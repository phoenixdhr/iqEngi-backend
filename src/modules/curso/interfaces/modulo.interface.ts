// curso/interfaces/modulo.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';
import { Unidad } from '../entities/unidad.entity';

export interface IModulo extends IdInterface {
  _id: Types.ObjectId;

  cursoId?: Types.ObjectId;
  numeroModulo: number;
  moduloTitle: string;
  descripcion?: string;
  unidades?: Unidad[];
}

export type IModuloInput = Omit<IModulo, '_id'>;
