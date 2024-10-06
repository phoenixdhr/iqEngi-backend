// orden.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { EstadoOrden } from '../../../common/enums/estado-orden.enum';
import { IOrden } from '../interfaces/orden.interface';

@ObjectType()
@Schema()
export class Orden extends Document implements IOrden {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => [Curso])
  @Prop({
    type: [
      {
        cursoId: { type: Types.ObjectId, ref: Curso.name },
        precio: { type: Number, required: true },
      },
    ],
    required: true,
  })
  cursos: Array<{ cursoId: Types.ObjectId; precio: number }>;

  @Field()
  @Prop({ required: true, default: Date.now })
  fechaCreacion: Date;

  @Field({ nullable: true })
  @Prop()
  fechaActualizacion?: Date;

  @Field(() => Float)
  @Prop({ required: true })
  montoTotal: number;

  @Field(() => EstadoOrden)
  @Prop({ enum: EstadoOrden, default: EstadoOrden.Pendiente })
  estado: EstadoOrden;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);

OrdenSchema.pre('save', function (next) {
  this.montoTotal = this.cursos.reduce((acc, curso) => acc + curso.precio, 0);
  this.fechaActualizacion = new Date();
  next();
});

OrdenSchema.index({ usuarioId: 1 });
