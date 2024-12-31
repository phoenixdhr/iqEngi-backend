// cuestionario/interfaces/opcion.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IOpcion extends IdInterface {
  _id: Types.ObjectId;
  textOpcion: string;
  esCorrecta?: boolean;
  orden?: number;
}

export type IOpcionInput = Omit<IOpcion, '_id'>;
