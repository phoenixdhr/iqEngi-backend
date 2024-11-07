import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { EstadoOrden } from '../../../common/enums/estado-orden.enum';
import { IOrden } from '../interfaces/orden.interface';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Orden extends Document implements IOrden, CreatedUpdatedDeletedBy {
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
  estado_orden: EstadoOrden;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  createdBy?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  updatedBy?: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ default: null })
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario, default: null })
  deletedBy?: Types.ObjectId;

  @Field(() => DocumentStatus)
  @Prop({
    type: String,
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);

OrdenSchema.pre('save', function (next) {
  this.montoTotal = this.cursos.reduce((acc, curso) => acc + curso.precio, 0);
  this.fechaActualizacion = new Date();
  next();
});

OrdenSchema.index({ usuarioId: 1 });
