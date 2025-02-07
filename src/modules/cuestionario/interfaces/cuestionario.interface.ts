// cuestionario/interfaces/cuestionario.interface.ts

import { Types } from 'mongoose';
import { IPregunta } from './pregunta.interface';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICuestionario extends IdInterface {
  _id: Types.ObjectId;
  cursoId: Types.ObjectId;
  cuestionarioTitle?: string;
  descripcion?: string;
  preguntas?: IPregunta[];
  published: boolean;
  notaMaxima?: number; // numero de preguntas correctas con las que se aprueba el curso
  notaMinimaAprobar?: number; // numero de preguntas correctas con las que se aprueba el curso
  fechaCreacion: Date;
}

export type ICuestionarioInput = Omit<
  ICuestionario,
  'fechaCreacion' | '_id' | 'preguntas'
> & {
  preguntas?: CreatePreguntaInput[];
};
