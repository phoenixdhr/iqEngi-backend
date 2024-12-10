// categoria/interfaces/categoria.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICategoria extends IdInterface {
  _id: Types.ObjectId;
  nombreCategoria: string;
  descripcion?: string;
}

export type ICategoriaInput = Omit<ICategoria, '_id'>;
