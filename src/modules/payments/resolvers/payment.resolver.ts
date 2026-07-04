/* MODIFICACIONES DESDE EL �LTIMO COMMIT:
 * - Actualizaci�n de resolvers GraphQL para reflejar el cambio a ProveedorPago.
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

import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { IniciarPagoThrottleGuard } from '../guards/iniciar-pago-throttle.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { allRoles } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { PaginationArgs } from 'src/common/dtos';

import { Payment } from '../entities/payment.entity';
import { PaymentService } from '../services/payment.service';
import { IniciarPagoInput } from '../dtos/iniciar-pago.input';
import { SincronizarEstadoOutput } from '../dtos/sincronizar-estado.output';
import { CheckoutResponse } from '../dtos/checkout-response.dto';

@Resolver(() => Payment)
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) { }

  /**
   * Inicia el flujo de compra. Esta es la función que se llama cuando un usuario hace clic en "Pagar" en el frontend
   * Crea una intención de pago en la pasarela, cancela órdenes pendientes anteriores
   * y devuelve los datos necesarios (como la URL de redirección) para que el frontend envíe al usuario a pagar.
   * Está protegido por un Rate Limit (usa el @UseGuard IniciarPagoThrottleGuard para evitar spam o clics duplicados).
   * 
   * @param input - Contiene la lista de cursos, método de pago y moneda seleccionada.
   * @param user - El usuario actualmente autenticado (extraído automáticamente del JWT).
   * @returns {Promise<Payment>} El registro del Payment creado (estado inicial Pendiente o EnProceso) que contiene el paymentUrl para redirigir al usuario a pagar.
   */

  @Mutation(() => CheckoutResponse, { name: 'Payment_iniciarPago' })
  @RolesDec(...allRoles)
  @UseGuards(IniciarPagoThrottleGuard)
  async iniciarPago(
    @Args('input') input: IniciarPagoInput,
    @CurrentUser() user: UserRequest,
  ): Promise<CheckoutResponse> {
    const userId = new Types.ObjectId(user._id);
    return this.paymentService.iniciarPago(input, userId, user.email);
  }

  /**
   * Obtiene la información detallada de una transacción/pago en específico.
   * Útil para generar tickets, recibos o ver el estado detallado de una compra.
   * Delega al servicio la validación de propiedad (IDOR) garantizando que el usuario solo vea sus pagos.
   * 
   * @param paymentId - El Object ID en MongoDB correspondiente al pago que se desea consultar.
   * @param user - El usuario actualmente autenticado que hace la consulta.
   * @returns {Promise<Payment>} El registro completo del pago.
   */

  @Query(() => Payment, { name: 'Payment_obtenerPorId' })
  @RolesDec(...allRoles)
  async obtenerPorId(
    @Args('paymentId', { type: () => ID }, IdPipe) paymentId: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Payment> {
    const userId = new Types.ObjectId(user._id);
    return this.paymentService.obtenerPorId(paymentId, userId);
  }

  /**
   * Confirma de inmediato si un pago fue exitoso tras la redirección desde la pasarela.
   * 
   * ¿Para qué sirve?
   * Cuando finaliza un cobro en MercadoPago (u otra pasarela), el navegador es redirigido 
   * automáticamente a nuestra página de confirmación. Al cargar esa página, nuestra web
   * ejecuta esta función.
   * 
   * Es una "red de seguridad": normalmente MercadoPago nos avisa por detrás (vía webhooks)
   * que el pago ya se cobró, pero a veces ese aviso tarda unos minutos. Para evitar esperas,
   * esta función va y le pregunta directamente a MercadoPago si el dinero ya entró. 
   * Si es así, libera el acceso al curso al instante.
   * 
   * @param ordenId - El ID de la orden que queremos verificar.
   * @param user - El usuario autenticado (para asegurar que nadie más pueda ver o alterar su pago).
   * @returns {Promise<SincronizarEstadoOutput>} El estado real y actualizado del pago.
   */

  @Mutation(() => SincronizarEstadoOutput, {
    name: 'Payment_verificarEstadoPorOrden',
  })
  @RolesDec(...allRoles)
  async verificarEstadoPorOrden(
    @Args('ordenId', { type: () => ID }, IdPipe) ordenId: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<SincronizarEstadoOutput> {
    const userId = new Types.ObjectId(user._id);
    return this.paymentService.verificarYSincronizarEstado(ordenId, userId);
  }

  /**
   * Obtiene la lista del historial de compras/pagos del usuario que realiza la consulta.
   * Típicamente usado para poblar la tabla de "Historial de transacciones" en "Mi Cuenta".
   * 
   * @param user - El usuario actualmente autenticado.
   * @param pagination - (Opcional) Argumentos de paginación: límite de ítems y offset para saltar resultados.
   * @returns {Promise<Payment[]>} Un arreglo con todos los pagos encontrados para ese usuario.
   */
  @Query(() => [Payment], { name: 'Payment_miHistorial' })
  @RolesDec(...allRoles)
  async miHistorial(
    @CurrentUser() user: UserRequest,
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Payment[]> {
    const userId = new Types.ObjectId(user._id);
    return this.paymentService.obtenerHistorial(
      userId,
      pagination?.limit,
      pagination?.offset,
    );
  }
}

