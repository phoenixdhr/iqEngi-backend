import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
import { Opcion, OpcionSchema } from './opcion.entity';
import { Types } from 'mongoose';
import { Modulo } from 'src/modules/curso/entities/modulo.entity';
import { Unidad } from 'src/modules/curso/entities/unidad.entity';
import { IPregunta } from '../interfaces/pregunta.interface';
import { Document } from 'mongoose';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// #region Pregunta
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Pregunta
  extends Document
  implements IPregunta, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  enunciado: string;

  @Field(() => TipoPregunta)
  @Prop({ required: true, enum: TipoPregunta })
  tipoPregunta: TipoPregunta;

  @Field(() => [Opcion], { nullable: true })
  @Prop({ type: [OpcionSchema], default: [] })
  opciones?: Opcion[];

  @Field(() => Modulo, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Modulo.name })
  moduloId?: Types.ObjectId;

  @Field(() => Unidad, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Unidad.name })
  unidadId?: Types.ObjectId;

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

export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);

PreguntaSchema.index({ status: 1 });
