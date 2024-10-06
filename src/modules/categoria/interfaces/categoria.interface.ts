// categoria/interfaces/categoria.interface.ts

import { Types } from 'mongoose';

export interface ICategoria {
  _id: Types.ObjectId;
  nombre: string;
  descripcion?: string;
}

export type ICategoriaInput = Omit<ICategoria, '_id'>;
