// curso/interfaces/modulo.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IModulo extends IdInterface {
  _id: Types.ObjectId;

  cursoId?: Types.ObjectId;
  numeroModulo: number;
  moduloTitle: string;
  descripcion?: string;
  unidades?: Types.ObjectId[];
}

export type IModuloInput = Omit<IModulo, '_id'>;
