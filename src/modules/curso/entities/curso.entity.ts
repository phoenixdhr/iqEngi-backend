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
import { CursoComprado } from 'src/modules/curso-comprado/entities/curso-comprado.entity';
import { Coleccion } from 'src/common/enums';
import { addPreUpdateSyncMiddleware } from 'src/common/middlewares/pre-update-campo.middleware';
import { IImage } from 'src/common/interfaces/iImage';
import { ImageObjectType } from 'src/common/dtos/image.objectType';

// #region Curso
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Curso extends AuditFields implements ICurso {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  courseTitle: string;

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

  @Field(() => ImageObjectType, { nullable: true })
  @Prop({ type: { url: String, alt: String } })
  imagenURL: IImage;

  @Field(() => Float, { nullable: true })
  @Prop()
  precio?: number;

  @Field({ nullable: true })
  @Prop({ default: 'USD' })
  currency?: string;

  @Field(() => Float, { nullable: true })
  @Prop({ default: 0 })
  descuento?: number;

  @Field(() => Float, { nullable: true })
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

  @Field(() => [Modulo], { nullable: true })
  @Prop({ type: [Types.ObjectId], ref: Modulo.name, default: [] })
  modulosIds: Types.ObjectId[];

  @Field({ nullable: true })
  @Prop()
  fechaLanzamiento?: Date;

  @Field(() => [Categoria])
  @Prop({ type: [Types.ObjectId], ref: Categoria.name, default: [] })
  categorias: Types.ObjectId[];

  @Field(() => Cuestionario, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Cuestionario.name })
  cuestionarioId?: Types.ObjectId;

  // CHANGE: Se agrega slug para SEO, búsquedas amigables, etc.
  @Field({ nullable: true })
  @Prop({ unique: true, sparse: true })
  slug?: string;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

//#region indexaciones
// permite realizar busquedas por titulo
CursoSchema.index({ courseTitle: 'text' });

CursoSchema.index({ categorias: 1 });
CursoSchema.index({ instructor: 1 });
CursoSchema.index({ cuestionarioId: 1 });
CursoSchema.index({ deleted: 1 });

// CHANGE: Se agrega índice en precio para facilitar búsquedas y filtros por rango.
CursoSchema.index({ precio: 1 });

//#region Middelwares
addSoftDeleteMiddleware<Curso, Curso>(CursoSchema);

addPreUpdateSyncMiddleware<Curso, CursoComprado, 'cursoId'>(
  CursoSchema,
  Coleccion.CursoComprado,
  'cursoId',
  (doc: Curso) => ({
    courseTitle: doc.courseTitle,
  }),
);
