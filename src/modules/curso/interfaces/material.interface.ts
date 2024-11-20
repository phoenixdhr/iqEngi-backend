// curso/interfaces/material.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IMaterial extends IdInterface {
  _id: Types.ObjectId;

  titulo: string;
  descripcion?: string;
  url: string;
}

export type IMaterialInput = Omit<IMaterial, '_id'>;
