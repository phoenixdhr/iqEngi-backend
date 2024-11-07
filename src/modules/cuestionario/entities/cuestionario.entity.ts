import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { Pregunta, PreguntaSchema } from './pregunta.entity';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { ICuestionario } from '../interfaces/cuestionario.interface';
import { Coleccion } from 'src/common/enums';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// #region Cuestionario
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Cuestionario
  extends Document
  implements ICuestionario, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Curso)
  @Prop({ type: Types.ObjectId, ref: Coleccion.Curso, required: true })
  cursoId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field(() => [Pregunta])
  @Prop({ type: [PreguntaSchema], default: [] })
  preguntas: Pregunta[];

  @Field(() => Int, { nullable: true })
  @Prop()
  numeroPreguntasPresentar?: number;

  @Field()
  @Prop({ default: Date.now })
  fechaCreacion: Date;

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
export const CuestionarioSchema = SchemaFactory.createForClass(Cuestionario);

CuestionarioSchema.index({ cursoId: 1 }, { unique: true });
CuestionarioSchema.index({ status: 1 });
