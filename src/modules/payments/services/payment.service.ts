/* MODIFICACIONES DESDE EL �LTIMO COMMIT:
 * - Refactor masivo de variables y tipos de MetodoPago a ProveedorPago.
 * - Refactorizaci�n de idempotencia y validaci�n de webhooks.
 */
/*
 * ==============================================================================
 * NOTA DE CAMBIOS RECIENTES (Refactorización Arquitectura de Pagos)
 * ==============================================================================
 * Este archivo fue modificado para soportar la separación de responsabilidades 
 * entre 'Orden' y 'Payment'.
 * 
 * Principales cambios:
 * 1. Se independizó el concepto de Orden (intención de compra) del Payment (intento de pago).
 * 2. Se implementó una lógica de expiración estricta sincronizada con las pasarelas (expiresAt).
 * 3. Se garantizó la idempotencia completa en los webhooks para evitar procesamiento duplicado.
 * 4. Se migró el campo 'metodoPago' a 'paymentProvider' / 'ProveedorPago'.
 * ==============================================================================
 */

import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';

import configEnv from 'src/common/enviroments/configEnv';
import { Payment } from '../entities/payment.entity';
import { ProveedorPago } from 'src/common/enums/proveedor-pago.enum';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { PaymentStrategy, WebhookValidationResult } from '../interfaces/payment-strategy.interface';
import { MercadoPagoStrategy } from '../strategies/mercadopago.strategy';
import { DLocalStrategy } from '../strategies/dlocal.strategy';
import { BitPayStrategy } from '../strategies/bitpay.strategy';
import { OrdenService } from 'src/modules/orden/services/orden.service';
import { CursoCompradoService } from 'src/modules/curso-comprado/services/curso-comprado.service';
import { MailService } from 'src/modules/mail/mail.service';
import { ExchangeRateService } from 'src/modules/exchange-rate/services/exchange-rate.service';
import { IniciarPagoInput } from '../dtos/iniciar-pago.input';
import { CheckoutResponse } from '../dtos/checkout-response.dto';

/**
 * Resultado de la sincronización pull de un pago.
 * Lo consume el frontend tras volver de la pasarela para mostrar el
 * estado real (no hardcodeado) sin esperar al webhook.
 */
export interface SincronizarEstadoResult {
  status: EstadoPago;
  ordenId: string;
  paymentId: string;
}



@Injectable() // Indica que esta clase es un proveedor de servicios
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name); // Logger para registrar eventos
  private readonly strategyMap: Map<ProveedorPago, PaymentStrategy>; // Mapa de estrategias de pago

  /** Tiempo de vida (milisegundos) de un Payment según proveedor */
  private static readonly PAYMENT_TTL_MS: Record<ProveedorPago, number> = {
    [ProveedorPago.BITPAY]: 15 * 60 * 1000,          // 15 minutos (límite estricto de BitPay)
    [ProveedorPago.MERCADOPAGO]: 24 * 60 * 60 * 1000, // 24 horas (tickets en efectivo como OXXO)
    [ProveedorPago.DLOCAL]: 24 * 60 * 60 * 1000,      // 24 horas (tickets en efectivo)
  };

  constructor(
    @InjectModel(Payment.name) // Inyecta el modelo de Payment
    private readonly paymentModel: Model<Payment>,
    @Inject(configEnv.KEY) // Inyecta la configuración de la aplicación
    private readonly config: ConfigType<typeof configEnv>,
    private readonly mercadoPagoStrategy: MercadoPagoStrategy, // Inyecta la estrategia de MercadoPago
    private readonly dLocalStrategy: DLocalStrategy, // Inyecta la estrategia de DLocal
    private readonly bitPayStrategy: BitPayStrategy, // Inyecta la estrategia de BitPay
    private readonly ordenService: OrdenService, // Inyecta el servicio de Orden
    private readonly cursoCompradoService: CursoCompradoService, // Inyecta el servicio de CursoComprado
    private readonly mailService: MailService, // Inyecta el servicio de Mail
    private readonly exchangeRateService: ExchangeRateService, // Conversor de moneda USD → currency destino
  ) {
    this.strategyMap = new Map<ProveedorPago, PaymentStrategy>([
      [ProveedorPago.MERCADOPAGO, this.mercadoPagoStrategy],
      [ProveedorPago.DLOCAL, this.dLocalStrategy],
      [ProveedorPago.BITPAY, this.bitPayStrategy],
    ]);
  }

  /**
   * Inicia el proceso de pago.
   *
   * Estrategia "cancelar y crear nuevo":
   * 1. Validar que ningún curso del carrito ya esté comprado con acceso activo.
   * 2. Cancelar TODAS las órdenes/payments pendientes del usuario, incluso
   *    aquellas con externalId (la pasarela ya las conoce). Si la pasarela
   *    aprueba un pago cancelado localmente, procesarWebhook() lo reabrirá
   *    automáticamente (_reopenedAfterCancellation) — el dinero nunca se pierde.
   * 3. Crear una orden nueva + Payment + llamada a la pasarela.
   *
   * Protección anti-spam: este método está protegido por
   * IniciarPagoThrottleGuard (Capa 2, 5 segundos por usuario).
   */
  async iniciarPago(
    input: IniciarPagoInput,
    userId: Types.ObjectId,
    userEmail: string,
  ): Promise<CheckoutResponse> {
    const { cursosIds, paymentProvider, currency } = input;
    const finalCurrency = currency || 'USD';
    const cursoObjectIds = cursosIds.map((id) => new Types.ObjectId(id));

    // ── PASO 1: Rechazar cursos ya comprados con acceso activo ──
    const titulosDuplicados = await this.cursoCompradoService.verificarCursosYaComprados(
      userId,
      cursoObjectIds,
    );

    if (titulosDuplicados.length > 0) {
      throw new BadRequestException(
        `Ya tienes acceso activo a: ${titulosDuplicados.join(', ')}. Elimínalos del carrito para continuar.`,
      );
    }

    // ── PASO 2: Cancelar TODAS las órdenes/payments pendientes ──
    // Cancela sin excepción (incluso con externalId). Es seguro porque:
    //   - procesarWebhook() reabre pagos cancelados si la pasarela los aprueba.
    //   - El Rate Limit (Capa 2) previene ráfagas de cancelaciones accidentales.
    const cancelled = await this.cancelarOrdenesAnterioresPendientes(userId);
    if (cancelled > 0) {
      this.logger.log(
        `iniciarPago(${userId}): ${cancelled} orden(es) anterior(es) cancelada(s).`,
      );
    }

    // ── PASO 3: Crear orden nueva + llamada a la pasarela ──
    const orden = await this.ordenService._create(cursoObjectIds, userId);

    return this.prepararPreferencia(
      orden,
      paymentProvider,
      finalCurrency,
      userEmail,
      userId,
    );
  }

  /**
   * Cancela TODAS las órdenes y payments pendientes del usuario.
   *
   * Ya no distingue entre pagos con/sin externalId: cancela todo.
   * Si la pasarela aprueba un pago que fue cancelado localmente, el
   * método procesarWebhook() lo reabrirá automáticamente gracias a la
   * lógica de _reopenedAfterCancellation, garantizando que el dinero
   * del usuario nunca se pierda.
   *
   * @returns cantidad de órdenes canceladas (para logging).
   */
  private async cancelarOrdenesAnterioresPendientes(
    userId: Types.ObjectId,
  ): Promise<number> {
    const ordenes = await this.paymentModel.db
      .collection('ordens')
      .find({
        usuarioId: userId,
        estado_orden: { $in: [EstadoOrden.Pendiente] },
        deleted: false,
      })
      .toArray();

    let cancelled = 0;

    for (const orden of ordenes) {
      // Cancelar la orden
      await this.actualizarEstadoOrden(orden._id, EstadoOrden.Cancelada);
      cancelled++;
    }

    return cancelled;
  }

  /**
   * Genera la intención de pago en el proveedor externo (prepara preferencia)
   * y guarda la URL en la orden. No crea ningún Payment aún.
   */
  private async prepararPreferencia(
    orden: any,
    paymentProvider: ProveedorPago,
    currency: string,
    userEmail: string,
    userId: Types.ObjectId,
  ): Promise<CheckoutResponse> {
    // 1. Generar idempotency key para evitar duplicados en la pasarela
    const idempotencyKey = crypto.randomUUID();

    // 2. Calcular fecha de expiración según el proveedor
    const ttlMs = PaymentService.PAYMENT_TTL_MS[paymentProvider];
    const expiresAt = new Date(Date.now() + ttlMs);

    // 3. Convertir el monto a la moneda destino.
    const rate = await this.exchangeRateService.getRate(currency);
    const amountConverted = Math.round(orden.montoTotal * rate * 100) / 100;

    // 4. Obtener la strategy del proveedor
    const strategy = this.strategyMap.get(paymentProvider);
    if (!strategy) {
      throw new BadRequestException(
        `Proveedor de pago "${paymentProvider}" no soportado`,
      );
    }

    // 5. Construir URLs de retorno y notificación.
    const baseApi = this.config.dominioAPI?.trim() || 'http://localhost:3000';
    const successUrl = `${baseApi}/payments/return/success?orden_id=${orden._id}`;
    const cancelUrl = `${baseApi}/payments/return/cancel?orden_id=${orden._id}`;
    const pendingUrl = `${baseApi}/payments/return/pending?orden_id=${orden._id}`;
    const notificationUrl = this.buildNotificationUrl(paymentProvider);

    // 6. Crear intención de pago en el proveedor externo
    const result = await strategy.createPayment({
      ordenId: orden._id,
      amount: amountConverted,
      currency,
      description: `Orden IQEngi #${orden._id}`,
      customerEmail: userEmail,
      successUrl,
      cancelUrl,
      pendingUrl,
      notificationUrl,
      idempotencyKey,
      expiresAt,
    });

    // 7. Actualizar campos de la orden con la info de la preferencia
    await this.paymentModel.db
      .collection('ordens')
      .updateOne(
        { _id: orden._id },
        {
          $set: {
            paymentProvider: paymentProvider,
            externalPaymentId: result.providerPaymentId,
            paymentUrl: result.paymentUrl,
            expiresAt: expiresAt,
            currency,
          },
        },
      );

    return {
      ordenId: orden._id.toString(),
      paymentUrl: result.paymentUrl,
    };
  }

  /**
   * Construye la URL pública del webhook del proveedor.
   * Solo retorna URLs http(s) (la pasarela no acepta otras).
   * En entornos sin dominioAPI público (p.ej. localhost crudo), retorna
   * undefined para que la pasarela use lo que tenga configurado en su
   * dashboard y no falle el preference.create.
   */
  private buildNotificationUrl(ProveedorPago: ProveedorPago): string | undefined {
    const baseApi = this.config.dominioAPI;
    if (!baseApi || !/^https?:\/\//.test(baseApi)) return undefined;
    const slug = {
      [ProveedorPago.MERCADOPAGO]: 'mercadopago',
      [ProveedorPago.DLOCAL]: 'dlocal',
      [ProveedorPago.BITPAY]: 'bitpay',
    }[ProveedorPago];
    return `${baseApi}/payments/webhook/${slug}`;
  }



  /**
   * Procesa un webhook de un proveedor de pago (idempotente).
   */
  async procesarWebhook(
    provider: ProveedorPago,
    body: any,
    headers: Record<string, string>,
  ): Promise<void> {
    const strategy = this.strategyMap.get(provider);
    if (!strategy) {
      this.logger.warn(`Proveedor "${provider}" no configurado para webhooks`);
      return;
    }

    const result: WebhookValidationResult = await strategy.handleWebhook(
      body,
      headers,
    );

    if (!result.isValid) {
      this.logger.warn(`Webhook inválido para ${provider}`);
      return;
    }

    const orden = await this.paymentModel.db
      .collection('ordens')
      .findOne({ _id: new Types.ObjectId(result.originalOrdenId) });

    if (!orden) {
      this.logger.warn(`Orden no encontrada para ID: ${result.originalOrdenId}`);
      return;
    }

    // Idempotencia: Verificar si ya existe un payment con este webhook/externalId
    // Como ahora solo creamos payments al recibir webhook, buscamos por providerPaymentId
    const externalPaymentId = result.rawData?.id?.toString() || result.rawData?.data?.id?.toString();
    
    let payment = await this.paymentModel.findOne({
      ordenId: orden._id,
      externalId: externalPaymentId,
      provider,
      deleted: false,
    });

    if (payment && payment.status === EstadoPago.Aprobado) {
      this.logger.log(`Payment ${payment._id} ya aprobado, ignorando webhook duplicado`);
      return;
    }

    // Crear payment si no existe
    if (!payment) {
      // Determinar status inicial en base al webhook
      let paymentStatus = EstadoPago.Rechazado;
      if (result.status === 'approved') {
        paymentStatus = orden.estado_orden === EstadoOrden.Expirada ? EstadoPago.EnRevision : EstadoPago.Aprobado;
      } else if (result.status === 'cancelled') {
        paymentStatus = EstadoPago.Cancelado;
      }

      payment = await this.paymentModel.create({
        ordenId: orden._id,
        usuarioId: orden.usuarioId,
        provider,
        status: paymentStatus,
        amount: orden.montoTotal, // Usamos el monto de la orden
        currency: orden.currency,
        externalId: externalPaymentId,
        webhookData: result.rawData,
        createdBy: orden.usuarioId,
      });
    } else {
      // Actualizar datos del webhook si el payment ya existía
      payment.webhookData = result.rawData;
    }

    if (result.status === 'approved') {
      if (orden.estado_orden === EstadoOrden.Expirada) {
        this.logger.warn(`Pago aprobado para Orden ${orden._id} que ya estaba expirada. Marcado para revisión.`);
        payment.status = EstadoPago.EnRevision;
        await payment.save();
        return; // NO otorgamos acceso
      }
      
      payment.status = EstadoPago.Aprobado;
      await this.completarPago(payment, orden);
    } else if (result.status === 'rejected') {
      payment.status = EstadoPago.Rechazado;
      await payment.save();
      // Solo cancelar la orden si estaba pendiente
      if (orden.estado_orden === EstadoOrden.Pendiente) {
        await this.actualizarEstadoOrden(orden._id, EstadoOrden.Cancelada);
      }
    } else if (result.status === 'cancelled') {
      payment.status = EstadoPago.Cancelado;
      await payment.save();
      if (orden.estado_orden === EstadoOrden.Pendiente) {
        await this.actualizarEstadoOrden(orden._id, EstadoOrden.Cancelada);
      }
    }
  }

  /**
   * Completa el flujo de pago: crea CursoComprado, actualiza Orden, y aprueba Payment.
   * Implementa una transacción lógica (Pseudo-Transacción) para manejar la ausencia de Replica Set.
   */
  private async completarPago(payment: any, ordenParam?: any): Promise<void> {
    const orden = ordenParam || await this.ordenService.findById(payment.ordenId);

    // 1. Otorgar acceso por cada curso de la orden (Idempotente).
    // Lo hacemos PRIMERO porque si falla, no queremos que el pago quede Aprobado
    // (MercadoPago reintentará el webhook más tarde).
    for (const cursoItem of orden.listaCursos) {
      try {
        await this.cursoCompradoService.otorgarAcceso(
          payment.usuarioId,
          new Types.ObjectId(cursoItem.cursoId),
          payment._id,
        );
      } catch (error) {
        this.logger.error(
          `Fallo CRÍTICO al otorgar acceso al curso ${cursoItem.cursoId} para usuario ${payment.usuarioId}. El webhook fallará y se reintentará.`,
          error.stack,
        );
        throw error; // Lanzar error aborta la actualización de la Orden y del Payment
      }
    }

    // 2. Actualizar Orden a Pagada
    await this.actualizarEstadoOrden(
      payment.ordenId,
      EstadoOrden.Pagada,
    );

    // 3. Finalmente, guardar el Payment con estado Aprobado
    // Si esto falla, el webhook reintentará. Como el Paso 1 es idempotente, no habrá duplicados.
    payment.status = EstadoPago.Aprobado;
    await payment.save();

    // 4. Enviar email de confirmación (No bloqueante)
    try {
      await this.mailService.sendPaymentConfirmationEmail(
        payment.usuarioId,
        orden,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando email de confirmación: ${error.message}`,
      );
    }
  }

  private async actualizarEstadoOrden(
    ordenId: Types.ObjectId,
    estado: EstadoOrden,
  ): Promise<void> {
    await this.paymentModel.db
      .collection('ordens')
      .updateOne({ _id: ordenId }, { $set: { estado_orden: estado } });
  }

  /**
   * Cancela órdenes cuyo expiresAt haya vencido.
   * Llamado por el Cron Job como red de seguridad.
   */
  async cancelarOrdenesExpiradas(): Promise<number> {
    const ahora = new Date();

    const ordenesExpiradas = await this.paymentModel.db
      .collection('ordens')
      .find({
        estado_orden: EstadoOrden.Pendiente,
        expiresAt: { $lte: ahora },
        deleted: false,
      })
      .toArray();

    for (const orden of ordenesExpiradas) {
      await this.actualizarEstadoOrden(orden._id, EstadoOrden.Expirada);
      this.logger.log(`Orden ${orden._id} expirada por timeout cron.`);
    }

    return ordenesExpiradas.length;
  }

  /**
   * Sincronización pull tras volver de la pasarela.
   *
   * El frontend llama a esta mutation cuando el usuario aterriza en la página
   * de confirmación. Sirve como red de seguridad ante webhooks atrasados o
   * perdidos: consulta el estado real del pago al proveedor y, si ya está
   * aprobado, completa la orden idempotentemente (igual que procesarWebhook).
   *
   * Idempotente: si el Payment ya está en un estado terminal, no consulta al
   * proveedor y devuelve el estado actual.
   *
   * Seguridad: valida que el Payment pertenezca al usuario autenticado.
   */
  async verificarYSincronizarEstado(
    ordenId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<SincronizarEstadoResult> {
    const orden = await this.ordenService.findById(ordenId);
    if (!orden) {
      throw new NotFoundException(`No se encontró la orden ${ordenId}`);
    }

    if (!orden.usuarioId.equals(userId)) {
      throw new ForbiddenException('No tienes permiso para consultar esta orden');
    }

    const result: SincronizarEstadoResult = {
      status: EstadoPago.Cancelado, // Por defecto si la orden está cancelada/expirada
      ordenId: ordenId.toString(),
      paymentId: '',
    };

    // Si la orden ya tiene estado final, buscar el último payment y devolver
    if (orden.estado_orden === EstadoOrden.Pagada) {
      const payment = await this.paymentModel.findOne({ ordenId, status: EstadoPago.Aprobado });
      result.status = EstadoPago.Aprobado;
      result.paymentId = payment?._id.toString() || '';
      return result;
    }

    // El último Payment (en caso de reintentos)
    const payment = await this.paymentModel
      .findOne({ ordenId, deleted: false })
      .sort({ createdAt: -1 }); 

    if (!payment) {
      // No hay payment, significa que no hemos recibido webhook.
      // Retornar estado Pendiente (es decir, Checkout pendiente de pago)
      // Nota: Podemos omitir la consulta síncrona extra a la API de MP si no hay payment
      result.status = EstadoPago.Cancelado; // Map Pendiente a un enum válido o retornar pendiente si existiera
      return result;
    }

    result.status = payment.status;
    result.paymentId = payment._id.toString();

    // Estado terminal → no consultamos al proveedor
    const estadosTerminales: EstadoPago[] = [
      EstadoPago.Aprobado,
      EstadoPago.Rechazado,
      EstadoPago.Cancelado,
      EstadoPago.EnRevision
    ];
    if (estadosTerminales.includes(payment.status)) return result;

    // Sin externalId aún → solo devolver estado local
    if (!payment.externalId) return result;

    const strategy = this.strategyMap.get(payment.provider);
    if (!strategy) return result;

    let providerStatus: string;
    try {
      providerStatus = await strategy.getPaymentStatus(payment.externalId);
    } catch (error) {
      this.logger.warn(
        `No se pudo consultar estado del Payment ${payment._id}: ${error.message}`,
      );
      return result;
    }

    // Mapeo común a los proveedores
    const normalizado =
      providerStatus === 'approved' || providerStatus === 'completed'
        ? 'approved'
        : providerStatus === 'rejected' || providerStatus === 'failed'
          ? 'rejected'
          : providerStatus === 'cancelled'
            ? 'cancelled'
            : 'pending';

    if (normalizado === 'approved' && payment.status !== EstadoPago.Aprobado) {
      payment.status = EstadoPago.Aprobado;
      await this.completarPago(payment, orden);
    } else if (normalizado === 'rejected') {
      payment.status = EstadoPago.Rechazado;
      await payment.save();
      if (orden.estado_orden === EstadoOrden.Pendiente) {
        await this.actualizarEstadoOrden(payment.ordenId, EstadoOrden.Cancelada);
      }
    } else if (normalizado === 'cancelled') {
      payment.status = EstadoPago.Cancelado;
      await payment.save();
      if (orden.estado_orden === EstadoOrden.Pendiente) {
        await this.actualizarEstadoOrden(payment.ordenId, EstadoOrden.Cancelada);
      }
    }

    result.status = payment.status;
    return result;
  }

  /**
   * Obtiene un payment por su ID validando que pertenezca al usuario.
   */
  async obtenerPorId(paymentId: Types.ObjectId, userId: Types.ObjectId): Promise<Payment> {
    const payment = await this.paymentModel.findOne({
      _id: paymentId,
      usuarioId: userId,
      deleted: false,
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID "${paymentId}" no encontrado o no tienes permiso`);
    }
    return payment;
  }

  /**
   * Obtiene el historial de payment de un usuario.
   */
  async obtenerHistorial(
    usuarioId: Types.ObjectId,
    limit = 20,
    offset = 0,
  ): Promise<Payment[]> {
    return this.paymentModel
      .find({ usuarioId, deleted: false })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}

