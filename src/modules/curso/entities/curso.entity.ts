import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Categoria } from '../../categoria/entities/categoria.entity';
import { Instructor } from '../../instructor/entities/instructor.entity';
import { ICurso } from '../interfaces/curso.interface';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Modulo } from './modulo.entity';
import { Cuestionario } from 'src/modules/cuestionario/entities/cuestionario.entity';
import { Nivel } from 'src/common/enums/nivel.enum';

// #region Curso
@ObjectType()
@Schema()
export class Curso extends Document implements ICurso {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field()
  @Prop({ required: true })
  descripcionCorta: string;

  @Field({ nullable: true })
  @Prop()
  descripcionLarga?: string;

  @Field(() => Nivel, { nullable: true })
  @Prop({ enum: Nivel })
  nivel?: Nivel;

  @Field(() => Instructor, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Instructor.name })
  instructor?: Types.ObjectId;

  @Field(() => Float, { nullable: true })
  @Prop()
  duracionHoras?: number;

  @Field({ nullable: true })
  @Prop()
  imagenURL?: string;

  @Field(() => Float)
  @Prop({ required: true })
  precio?: number;

  @Field(() => Float, { nullable: true })
  @Prop({ default: 0 })
  descuento?: number;

  @Field(() => Float)
  @Prop({ nullable: true })
  calificacionPromedio?: number;

  @Field(() => Int)
  @Prop({ default: 0 })
  numeroCalificaciones?: number;

  @Field(() => [String])
  @Prop({ default: [] })
  aprenderas: string[];

  @Field(() => [String])
  @Prop({ default: [] })
  objetivos: string[];

  @Field(() => [String])
  @Prop({ default: [] })
  dirigidoA: string[];

  @Field(() => [Modulo])
  @Prop({ type: [Types.ObjectId], ref: Modulo.name, default: [] })
  modulos: Types.ObjectId[];

  @Field({ nullable: true })
  @Prop()
  fechaLanzamiento?: Date;

  @Field(() => [Categoria])
  @Prop({ type: [Types.ObjectId], ref: Categoria.name, default: [] })
  categorias: Types.ObjectId[];

  @Field(() => Cuestionario, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Cuestionario.name })
  cuestionarioId?: Types.ObjectId;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

CursoSchema.index({ titulo: 'text' });
CursoSchema.index({ categorias: 1, cuestionarioId: 1 });
