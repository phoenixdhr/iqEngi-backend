// calificacion.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackError, Document, Query, Types } from 'mongoose';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ICalificacion } from '../interfaces/calificacion.interface';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Calificacion
  extends Document
  implements ICalificacion, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => Curso)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true, min: 1, max: 5 })
  valor: number;

  @Field({ nullable: true })
  @Prop()
  comentario?: string;

  @Field()
  @Prop({ default: Date.now })
  fecha: Date;

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

export const CalificacionSchema = SchemaFactory.createForClass(Calificacion);

CalificacionSchema.index({ usuarioId: 1, cursoId: 1 }, { unique: true });
CalificacionSchema.index({ status: 1 });

CalificacionSchema.pre(
  /^find/,
  function (
    this: Query<Calificacion | Calificacion[], Calificacion>,
    next: (err?: CallbackError) => void,
  ) {
    this.where({ status: { $ne: DocumentStatus.DELETED } });
    next();
  },
);
