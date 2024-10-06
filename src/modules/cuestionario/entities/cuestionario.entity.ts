import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { Pregunta, PreguntaSchema } from './pregunta.entity';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { ICuestionario } from '../interfaces/cuestionario.interface';
import { Coleccion } from 'src/common/enums';

// #region Cuestionario
@ObjectType()
@Schema()
export class Cuestionario extends Document implements ICuestionario {
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
}
export const CuestionarioSchema = SchemaFactory.createForClass(Cuestionario);

CuestionarioSchema.index({ cursoId: 1 }, { unique: true });
