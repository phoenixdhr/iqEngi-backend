import { registerEnumType } from '@nestjs/graphql';

export enum EstadoOrden {
  Pendiente = 'pendiente', // La orden ha sido creada pero no ha sido pagada
  Pagada = 'pagada', // La orden ha sido pagada exitosamente
  Cancelada = 'cancelada', // La orden ha sido cancelada o el usuario desistió
  Expirada = 'expirada', // La orden expiró sin recibir pago
  Reembolsada = 'reembolsada', // La orden ha sido reembolsada
}

registerEnumType(EstadoOrden, {
  name: 'EstadoOrden',
  description: 'Estados del ciclo de vida de una orden',
});
