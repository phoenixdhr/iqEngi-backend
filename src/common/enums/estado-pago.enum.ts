import { registerEnumType } from '@nestjs/graphql';

export enum EstadoPago {
  Pendiente = 'pendiente',
  EnProceso = 'en_proceso',
  Aprobado = 'aprobado',
  Rechazado = 'rechazado',
  Reembolsado = 'reembolsado',
  Cancelado = 'cancelado',
}

registerEnumType(EstadoPago, {
  name: 'EstadoPago',
  description: 'Estados de un pago',
});
