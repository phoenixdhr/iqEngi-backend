import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Categoria } from '../../categoria/entities/categoria.entity';
import { Instructor } from '../../instructor/entities/instructor.entity';
import { ICurso } from '../interfaces/curso.interface';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Modulo } from './modulo.entity';
import { Cuestionario } from 'src/modules/cuestionario/entities/cuestionario.entity';
import { Nivel } from 'src/common/enums/nivel.enum';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

// #region Curso
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Curso extends AuditFields implements ICurso {
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

  @Field(() => Float, { nullable: true })
  @Prop()
  precio?: number;

  @Field({ nullable: true })
  @Prop()
  currency?: string;

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

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

// permite realizar busquedas por titulo
CursoSchema.index({ titulo: 'text' }, { unique: true });

CursoSchema.index({ categorias: 1 });
CursoSchema.index({ instructor: 1 });
CursoSchema.index({ cuestionarioId: 1 });
CursoSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Curso, Curso>(CursoSchema);
