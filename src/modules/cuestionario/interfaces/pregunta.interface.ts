// cuestionario/interfaces/pregunta.interface.ts

import { Types } from 'mongoose';
import { IOpcion } from './opcion.interface';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IPregunta extends IdInterface {
  _id: Types.ObjectId;
  enunciado: string;
  tipoPregunta: TipoPregunta; // O el enum TipoPregunta
  opciones?: IOpcion[];
  moduloId?: Types.ObjectId;
  unidadId?: Types.ObjectId;
  respuestaOrdenamiento?: string;
  published?: boolean;
  puntos: number;
}

export type IPreguntaInput = Omit<IPregunta, '_id' | 'opciones'> & {
  opciones?: CreateOpcionInput[];
};
