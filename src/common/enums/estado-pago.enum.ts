import { registerEnumType } from '@nestjs/graphql';

export enum EstadoPago {
  /**
   * Estado inicial al crear un registro Payment en la base de datos,
   * antes de contactar al proveedor externo (MercadoPago, DLocal, BitPay).
   * Se asigna en `crearPaymentParaOrden()` al persistir el documento.
   * Transiciones posibles → EnProceso (proveedor respondió con paymentUrl)
   *                        → Cancelado  (expiró por cron o cambio de método/moneda)
   */
  Pendiente = 'pendiente',

  /**
   * El proveedor externo creó la intención de pago y devolvió una paymentUrl.
   * Se asigna en `crearPaymentParaOrden()` tras recibir respuesta exitosa del proveedor,
   * y también en `procesarWebhook()` cuando el webhook indica estado "pending".
   * Transiciones posibles → Aprobado  (webhook con status "approved")
   *                        → Rechazado (webhook con status "rejected")
   *                        → Cancelado (webhook con status "cancelled" o expiración por cron)
   */
  EnProceso = 'en_proceso',

  /**
   * El proveedor confirmó el pago exitoso mediante webhook (status "approved").
   * Se asigna en `procesarWebhook()` y dispara `completarPago()`, que:
   *   - Cambia la Orden a "Completada"
   *   - Crea los registros CursoComprado para cada curso
   *   - Envía email de confirmación al usuario
   * Es un estado FINAL e IDEMPOTENTE: webhooks duplicados se ignoran.
   * Transición posible → Reembolsado (actualmente no implementado en código)
   */
  Aprobado = 'aprobado',

  /**
   * El proveedor rechazó el pago mediante webhook (status "rejected"),
   * por ejemplo: fondos insuficientes, tarjeta rechazada, datos incorrectos.
   * Se asigna en `procesarWebhook()` y cambia la Orden asociada a "Cancelada".
   * Es un estado FINAL: el usuario debe iniciar un nuevo flujo de pago.
   */
  Rechazado = 'rechazado',

  /**
   * Se emitió un reembolso total o parcial al usuario.
   * NOTA: Actualmente NO se asigna en ninguna parte del código;
   * está reservado para una futura implementación de reembolsos.
   */
  Reembolsado = 'reembolsado',

  /**
   * El pago fue cancelado. Se asigna en tres escenarios:
   * 1. `iniciarPago()` — el usuario cambió de método de pago o moneda,
   *    cancelando el Payment anterior de la misma Orden.
   * 2. `procesarWebhook()` — el proveedor notificó status "cancelled".
   * 3. `cancelarPagosExpirados()` — cron job que cancela Payments cuyo
   *    `expiresAt` venció (red de seguridad ante webhooks perdidos).
   * En todos los casos, la Orden asociada se actualiza a "Cancelada".
   * Es un estado FINAL: el usuario debe iniciar un nuevo flujo de pago.
   */
  Cancelado = 'cancelado',
}

registerEnumType(EstadoPago, {
  name: 'EstadoPago',
  description: 'Estados de un pago',
});
