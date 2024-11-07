import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Categoria } from '../../categoria/entities/categoria.entity';
import { Instructor } from '../../instructor/entities/instructor.entity';
import { ICurso } from '../interfaces/curso.interface';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Modulo } from './modulo.entity';
import { Cuestionario } from 'src/modules/cuestionario/entities/cuestionario.entity';
import { Nivel } from 'src/common/enums/nivel.enum';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// #region Curso
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Curso extends Document implements ICurso, CreatedUpdatedDeletedBy {
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

export const CursoSchema = SchemaFactory.createForClass(Curso);

// permite realizar busquedas por titulo
CursoSchema.index({ titulo: 'text' });

CursoSchema.index({ categorias: 1 });
CursoSchema.index({ instructor: 1 });
CursoSchema.index({ cuestionarioId: 1 });
CursoSchema.index({ status: 1 });
