import { registerEnumType } from '@nestjs/graphql';

export enum EstadoOrden {
  Pendiente = 'pendiente', // La orden ha sido creada pero no ha sido procesada
  Procesando = 'procesando', // La orden está siendo procesada
  Completada = 'completada', // La orden ha sido completada
  Cancelada = 'cancelada', // La orden ha sido cancelada osea no se ha completado
  Reembolsada = 'reembolsada', // La orden ha sido reembolsada
}

registerEnumType(EstadoOrden, {
  name: 'EstadoOrden',
  description: 'Estados de una orden',
});
