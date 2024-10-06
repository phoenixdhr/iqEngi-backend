// cuestionario/interfaces/opcion.interface.ts

import { Types } from 'mongoose';

export interface IOpcion {
  _id: Types.ObjectId;
  textOpcion: string;
  esCorrecta: boolean;
  orden?: number;
}

export type IOpcionInput = Omit<IOpcion, '_id'>;
