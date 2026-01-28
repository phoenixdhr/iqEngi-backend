import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { Cuestionario } from 'src/modules/cuestionario/entities/cuestionario.entity';
import { Nivel } from 'src/common/enums/nivel.enum';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { ICurso } from '../../interfaces/curso.interface';
import { Instructor } from 'src/modules/instructor/entities/instructor.entity';
import { Modulo } from '../../entities/modulo.entity';
import { Categoria } from 'src/modules/categoria/entities/categoria.entity';
import { ImageObjectType } from 'src/common/dtos/image.objectType';

// #region Curso
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class CursoOutput extends AuditFields implements ICurso {
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
  imagenURL: ImageObjectType;

  @Field({ nullable: true })
  @Prop()
  urlVideo?: string;

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

  @Field(() => [ID], { nullable: true })
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
