import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Entidades } from '../../_common/nameEntidaes';

// Tipo Enumerado para TipoPregunta
export enum TipoPregunta {
  Abierta = 'abierta',
  Alternativa = 'alternativa',
  Opcion_multiple = 'opcion_multiple',
  Verdadero_falso = 'verdadero_falso',
  Ordenamiento = 'ordenamiento',
}

// #region Opcion
@Schema()
export class Opcion extends Document {
  @Prop({ required: true })
  textOpcion: string;

  @Prop({ required: true })
  esCorrecta: number; // 0: Incorrecta, 1: Correcta, si hay numeros mayores a 1, se considera una pregunta con ordenamiento
}

export const OpcionSchema = SchemaFactory.createForClass(Opcion);

// #region Pregunta
@Schema()
export class Pregunta extends Document {
  @Prop({ required: true })
  enunciado: string;

  @Prop({ required: true, enum: TipoPregunta })
  tipoPregunta: TipoPregunta;

  @Prop({ type: [OpcionSchema], default: [] })
  opciones: Types.DocumentArray<Opcion>;
}

export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);

// #region Cuestionario
@Schema()
export class Cuestionario extends Document {
  // @Prop({ type: Types.ObjectId, ref: Entidades.Curso, required: true })
  // cursoId: Types.ObjectId;

  @Prop()
  tituloCuestionario: string;

  @Prop()
  descripcionCuestionario: string;

  @Prop({ type: [PreguntaSchema], default: [] })
  preguntas: Types.DocumentArray<Pregunta>;

  @Prop({ default: new Date() })
  fecha: Date;

  @Prop({
    type: Types.ObjectId,
    ref: Entidades.UnidadEducativa,
    required: true,
    index: true,
  })
  unidadEducativaId: Types.ObjectId; // Referencia única a la Unidad Educativa asociada
}

export const CuestionarioSchema = SchemaFactory.createForClass(Cuestionario);
