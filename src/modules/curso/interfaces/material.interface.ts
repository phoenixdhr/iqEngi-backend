// curso/interfaces/material.interface.ts

import { Types } from 'mongoose';

export interface IMaterial {
  _id?: Types.ObjectId;

  titulo: string;
  descripcion?: string;
  url: string;
}

export type IMaterialInput = Omit<IMaterial, '_id'>;
