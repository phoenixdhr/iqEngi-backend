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

  @Prop()
  fechaCompra?: Date; // NOTA ESTA FECHA SE GUARDARA CUANDO EL "estado" SEA "Completa" o "Reembolsada" o "Cancelada"

  @Prop()
  montoTotal: number; // Monto que se paga por todos los curos, es autocalculado

  @Prop({ enum: EstadoOrden, default: EstadoOrden.Pendiente })
  estado: EstadoOrden;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);

OrdenSchema.pre('save', async function (next) {
  try {
    if (this.isNew || this.isModified('cursos')) {
      const populatedOrden = await this.populate('cursos');
      const arrayCursos =
        populatedOrden.cursos as unknown as Types.DocumentArray<Curso>;
      this.montoTotal = arrayCursos.reduce(
        (acc, curso) => acc + curso.precio,
        0,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});
