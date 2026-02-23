import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';

import configEnv from 'src/common/enviroments/configEnv';
import { Payment } from '../entities/payment.entity';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { PaymentStrategy, WebhookValidationResult } from '../interfaces/payment-strategy.interface';
import { MercadoPagoStrategy } from '../strategies/mercadopago.strategy';
import { DLocalStrategy } from '../strategies/dlocal.strategy';
import { BitPayStrategy } from '../strategies/bitpay.strategy';
import { OrdenService } from 'src/modules/orden/services/orden.service';
import { CursoCompradoService } from 'src/modules/curso-comprado/services/curso-comprado.service';
import { MailService } from 'src/modules/mail/mail.service';
import { IniciarPagoInput } from '../dtos/iniciar-pago.input';



@Injectable() // Indica que esta clase es un proveedor de servicios
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name); // Logger para registrar eventos
  private readonly strategyMap: Map<MetodoPago, PaymentStrategy>; // Mapa de estrategias de pago

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
  ) {
    this.strategyMap = new Map<MetodoPago, PaymentStrategy>([
      [MetodoPago.MERCADOPAGO, this.mercadoPagoStrategy],
      [MetodoPago.DLOCAL, this.dLocalStrategy],
      [MetodoPago.BITPAY, this.bitPayStrategy],
    ]);
  }

  /**
   * Inicia el proceso de pago: crea Orden + Payment + llama strategy.
   */
  async iniciarPago(
    input: IniciarPagoInput,
    userId: Types.ObjectId,
    userEmail: string,
  ): Promise<Payment> {
    const { cursosIds, metodoPago, currency } = input;
    const finalCurrency = currency || 'USD';

    // 1. Crear la orden en base de datos
    const orden = await this.ordenService._create(
      cursosIds.map((id) => new Types.ObjectId(id)),
      userId,
    );

    // 2. Generar idempotency key para evitar pagos duplicados
    const idempotencyKey = crypto.randomUUID();

    // 3. Crear registro Payment pendiente en base de datos
    const payment = await this.paymentModel.create({
      ordenId: orden._id,
      usuarioId: userId,
      provider: metodoPago,
      status: EstadoPago.Pendiente,
      amount: orden.montoTotal,
      currency: finalCurrency,
      idempotencyKey,
      createdBy: userId,
    });

    // 4. Obtener la strategy
    const strategy = this.strategyMap.get(metodoPago);
    if (!strategy) {
      throw new BadRequestException(
        `Proveedor de pago "${metodoPago}" no soportado`,
      );
    }

    // 5. Construir URLs de retorno
    const baseApi = this.config.dominioAPI;
    const successUrl = `${baseApi}/payments/return/success?orden_id=${orden._id}`; // URL de retorno en caso de éxito
    const cancelUrl = `${baseApi}/payments/return/cancel?orden_id=${orden._id}`; // URL de retorno en caso de cancelación
    const pendingUrl = `${baseApi}/payments/return/pending?orden_id=${orden._id}`; // URL de retorno en caso de pago pendiente

    // 6. Crear pago (intención de pago) en el proveedor externo
    const result = await strategy.createPayment({
      ordenId: orden._id,
      amount: orden.montoTotal,
      currency: finalCurrency,
      description: `Orden IQEngi #${orden._id}`,
      customerEmail: userEmail,
      successUrl,
      cancelUrl,
      pendingUrl,
      idempotencyKey,
    });

    // 7. Actualizar las colecciones: Payment y Orden con datos del proveedor
    // AQUÍ GUARDAMOS EL ID GENERADO POR MERCADO PAGO, devuelto en CreatePaymentResult
    payment.externalId = result.providerPaymentId;
    payment.paymentUrl = result.paymentUrl; // Guarda el enlace de pago al que el usuario debe ser redirigido.
    payment.status = EstadoPago.EnProceso; //  Cambia el estado interno del pago de "Pendiente" a "EnProceso", indicando que ya se generó el cobro en el proveedor, pero el usuario aún no ha terminado de pagarlo.
    await payment.save(); //  Ejecuta la consulta a MongoDB para guardar permanentemente estos cambios en el documento Payment

    // Actualizar campos de la orden
    await this.paymentModel.db
      .collection('ordens')// 
      .updateOne(
        { _id: orden._id },
        {
          $set: {
            paymentMethod: metodoPago,
            externalPaymentId: result.providerPaymentId,
            paymentUrl: result.paymentUrl,
            estado_orden: EstadoOrden.Procesando,
            currency: finalCurrency,
          },
        },
      );

    return payment;
  }

  /**
   * Procesa un webhook de un proveedor de pago (idempotente).
   */
  async procesarWebhook(
    provider: MetodoPago,
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

    // AQUÍ ESTÁ LA CONFUSIÓN DE LA VARIABLE: 
    // El "result.originalOrdenId" que devuelve WebhookValidationResult contiene 
    // NUESTRO ORDEN ID ORIGINAL (el external_reference).
    // Por lo tanto, buscamos el documento Payment comparando su "ordenId" contra ese valor devuelto.
    const payment = await this.paymentModel.findOne({
      ordenId: new Types.ObjectId(result.originalOrdenId), // ¡Buscamos por ordenId!
      provider,
      deleted: false,
    });

    if (!payment) {
      this.logger.warn(
        `Payment no encontrado para ordenId: ${result.originalOrdenId}`,
      );
      return;
    }

    // Idempotencia: no reprocesar si ya está aprobado
    if (payment.status === EstadoPago.Aprobado) {
      this.logger.log(
        `Payment ${payment._id} ya aprobado, ignorando webhook duplicado`,
      );
      return;
    }

    // Guardar datos del webhook
    payment.webhookData = result.rawData;

    if (result.status === 'approved') {
      payment.status = EstadoPago.Aprobado;
      await payment.save();
      await this.completarPago(payment);
    } else if (result.status === 'rejected') {
      payment.status = EstadoPago.Rechazado;
      await payment.save();
      await this.actualizarEstadoOrden(
        payment.ordenId,
        EstadoOrden.Cancelada,
      );
    } else if (result.status === 'cancelled') {
      payment.status = EstadoPago.Cancelado;
      await payment.save();
      await this.actualizarEstadoOrden(
        payment.ordenId,
        EstadoOrden.Cancelada,
      );
    } else {
      // pending
      payment.status = EstadoPago.EnProceso;
      await payment.save();
    }
  }

  /**
   * Completa el flujo de pago: actualiza Orden, crea CursoComprado, envía email.
   */
  private async completarPago(payment: Payment): Promise<void> {
    // 1. Actualizar Orden a Completada
    await this.actualizarEstadoOrden(
      payment.ordenId,
      EstadoOrden.Completada,
    );

    // 2. Obtener la orden para acceder a los cursos
    const orden = await this.ordenService.findById(payment.ordenId);

    // 3. Crear CursoComprado por cada curso de la orden
    for (const cursoItem of orden.listaCursos) {
      try {
        await this.cursoCompradoService.create(
          {
            cursoId: new Types.ObjectId(cursoItem.cursoId),
            usuarioId: payment.usuarioId,
          } as any,
          payment.usuarioId,
        );
      } catch (error) {
        this.logger.error(
          `Error creando CursoComprado para curso ${cursoItem.cursoId}: ${error.message}`,
        );
      }
    }

    // 4. Enviar email de confirmación
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
   * Obtiene un payment por su ID.
   */
  async obtenerPorId(paymentId: Types.ObjectId): Promise<Payment> {
    const payment = await this.paymentModel.findOne({
      _id: paymentId,
      deleted: false,
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID "${paymentId}" no encontrado`);
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
