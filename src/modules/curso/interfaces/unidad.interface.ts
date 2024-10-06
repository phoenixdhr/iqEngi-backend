// curso/interfaces/unidad.interface.ts

import { Types } from 'mongoose';
import { IMaterial } from './material.interface';
import { CreateMaterialInput } from '../dtos/material-dtos/create-material.input';

export interface IUnidad {
  _id: Types.ObjectId;

  moduloId: Types.ObjectId;
  numeroUnidad: number;
  titulo: string;
  descripcion?: string;
  urlVideo?: string;
  materiales?: IMaterial[];
}

export type IUnidadInput = Omit<IUnidad, '_id' | 'materiales'> & {
  materiales?: CreateMaterialInput[];
};
