import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoOrden {
  Pendiente = 'pendiente', // La orden ha sido creada pero no ha sido procesada
  Procesando = 'procesando', // La orden está siendo procesada
  Completada = 'completada', // La orden ha sido completada
  Cancelada = 'cancelada', // La orden ha sido cancelada osea no se ha completado
  Reembolsada = 'reembolsada', // La orden ha sido reembolsada
}

// #region Orden
@Schema()
export class Orden extends Document {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: Curso.name, required: true })
  cursos: Types.Array<Types.ObjectId>;

  @Prop({ required: true })
  fechaCompra?: Date; // ESTA FECHA SE GUARDARA CUANDO EL "estado" SEA "Completa" o "Reembolsada" o "Cancelada"

  @Prop({ required: true })
  montoTotal: number; // ESTE MONTO QUE SE DEBE PAGAR POR TODOS LOS CURSOS

  @Prop({ enum: EstadoOrden, default: EstadoOrden.Pendiente })
  estado: EstadoOrden;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);
