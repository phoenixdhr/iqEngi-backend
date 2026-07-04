import { registerEnumType } from '@nestjs/graphql';

export enum EstadoPago {
  /**
   * El proveedor confirmó el pago exitoso mediante webhook (status "approved").
   * Transición posible → Reembolsado
   */
  Aprobado = 'aprobado',

  /**
   * El proveedor rechazó el pago mediante webhook (status "rejected").
   */
  Rechazado = 'rechazado',

  /**
   * Se emitió un reembolso total o parcial al usuario.
   */
  Reembolsado = 'reembolsado',

  /**
   * El pago fue cancelado o expirado.
   */
  Cancelado = 'cancelado',

  /**
   * Se recibe un pago aprobado pero la orden ya estaba expirada.
   * Requiere revisión manual y no otorga acceso automático.
   */
  EnRevision = 'en_revision',
}

registerEnumType(EstadoPago, {
  name: 'EstadoPago',
  description: 'Estados de un pago (solo intentos reales notificados por webhook)',
});
