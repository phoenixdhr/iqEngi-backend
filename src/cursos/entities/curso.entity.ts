import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Categoria } from '../../categorias/entities/categoria.entity';
import { Instructores } from '../../instructores/entities/instructores.entity';
import { EstructuraProgramaria } from '../../estructura-programaria/entities/estructura-programaria.entity';

export enum Nivel {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',
}

// #region Curso
@Schema()
export class Curso extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  descripcionCorta: string;

  @Prop({ enum: Nivel })
  nivel?: Nivel;

  @Prop({ type: Types.ObjectId, ref: Instructores.name })
  instructor?: Types.ObjectId | Instructores;

  @Prop()
  duracionHoras?: number;

  @Prop()
  imagenURL?: string; // Opcional, podría tener una imagen por defecto

  @Prop()
  precio?: number;

  @Prop()
  descuentos?: number;

  @Prop()
  calificacion?: number; // Opcional, inicialmente podría no tener calificación

  @Prop({ default: [] })
  aprenderas: Types.Array<string>;

  @Prop({ default: [] })
  objetivos: Types.Array<string>;

  @Prop({ default: [] })
  dirigidoA: Types.Array<string>;

  @Prop({
    type: [Types.ObjectId],
    ref: EstructuraProgramaria.name,
    default: [],
  })
  estructuraProgramaria:
    | Types.Array<Types.ObjectId>
    | Types.DocumentArray<EstructuraProgramaria>; // Opcional, pero crítico para el desarrollo del curso

  @Prop()
  fechaLanzamiento?: Date;

  @Prop({ type: [Types.ObjectId], ref: Categoria.name, default: [] })
  categorias: Types.Array<Types.ObjectId>; // Requerido, debe categorizarse desde el inicio
}

export const CursoSchema = SchemaFactory.createForClass(Curso);
