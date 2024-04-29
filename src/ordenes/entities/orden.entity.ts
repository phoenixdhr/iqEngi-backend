import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoOrden {
  Pendiente = 'pendiente',
  Procesando = 'procesando',
  Completada = 'completada',
  Cancelada = 'cancelada',
  Reembolsada = 'reembolsada',
}

//ENTIDAD
@Schema()
export class Orden extends Document {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: Curso.name, required: true })
  cursos: Types.Array<Curso>;

  @Prop({ required: true })
  fechaCompra: Date;

  @Prop({ required: true })
  montoTotal: number;

  @Prop({ enum: EstadoOrden, required: true })
  estado: EstadoOrden;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);
