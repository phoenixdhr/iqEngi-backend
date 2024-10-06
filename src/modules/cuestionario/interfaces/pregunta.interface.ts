// cuestionario/interfaces/pregunta.interface.ts

import { Types } from 'mongoose';
import { IOpcion } from './opcion.interface';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';

export interface IPregunta {
  _id: Types.ObjectId;
  enunciado: string;
  tipoPregunta: TipoPregunta; // O el enum TipoPregunta
  opciones?: IOpcion[];
  moduloId?: Types.ObjectId;
  unidadId?: Types.ObjectId;
}

export type IPreguntaInput = Omit<IPregunta, '_id' | 'opciones'> & {
  opciones?: CreateOpcionInput[];
};
