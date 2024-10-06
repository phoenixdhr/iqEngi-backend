// curso/interfaces/modulo.interface.ts

import { Types } from 'mongoose';

export interface IModulo {
  _id: Types.ObjectId;

  cursoId: Types.ObjectId;
  numeroModulo: number;
  titulo: string;
  descripcion?: string;
  unidades?: Types.ObjectId[];
}

export type IModuloInput = Omit<IModulo, '_id'>;
