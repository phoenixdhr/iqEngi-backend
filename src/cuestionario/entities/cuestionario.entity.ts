// import type { Id } from '../../_common/dtos/id';
// import { Curso } from '../../cursos/entities/curso.entity';

// // Define los posibles tipos de preguntas que pueden existir en el sistema.
// export enum TipoPregunta {
//   Abierta = 'abierta',
//   Alternativa = 'alternativa',
//   Opcion_multiple = 'opcion_multiple',
//   Verdadero_falso = 'verdadero_falso',
//   Ordenamiento = 'ordenamiento',
// }

// export interface Opciones {
//   _id: Id;
//   texto: string;
//   esCorrecta?: boolean | number;
// }

// export interface Pregunta {
//   _id: Id;
//   enunciado: string;
//   tipo: TipoPregunta;
//   opciones: Opciones[];
// }

// //ENTIDAD
// export class Cuestionario {
//   _id: Id;
//   cursoId: Curso['_id'];
//   titulo?: string;
//   descripcion?: string;
//   preguntas: Pregunta[];
//   fecha?: Date;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Curso } from 'src/cursos/entities/curso.entity';

// Tipo Enumerado para TipoPregunta
export enum TipoPregunta {
  Abierta = 'abierta',
  Alternativa = 'alternativa',
  Opcion_multiple = 'opcion_multiple',
  Verdadero_falso = 'verdadero_falso',
  Ordenamiento = 'ordenamiento',
}

// Esquema y clase para Opciones
@Schema()
export class Opciones extends Document {
  @Prop({ required: true })
  texto: string;

  @Prop()
  esCorrecta?: boolean | number;
}

export const OpcionesSchema = SchemaFactory.createForClass(Opciones);

// // Esquema embebido referenciadp
// Esquema y clase para Pregunta
@Schema()
export class Pregunta extends Document {
  @Prop({ required: true })
  enunciado: string;

  @Prop({ required: true, enum: TipoPregunta })
  tipo: TipoPregunta;

  @Prop({ type: [Types.ObjectId], ref: Opciones.name })
  opciones: Types.ObjectId[] | Opciones[];
}

export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);

// Esquema y clase para Cuestionario
@Schema()
export class Cuestionario extends Document {
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Prop()
  titulo?: string;

  @Prop()
  descripcion?: string;

  @Prop({ type: [Types.ObjectId], ref: Pregunta.name })
  preguntas: Types.ObjectId[] | Pregunta[];

  @Prop()
  fecha?: Date;
}

export const CuestionarioSchema = SchemaFactory.createForClass(Cuestionario);
