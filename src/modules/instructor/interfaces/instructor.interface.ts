// instructor/interfaces/instructor.interface.ts

import { Types } from 'mongoose';

export interface IInstructor {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  profesion?: string;
  especializacion?: string[];
  calificacionPromedio?: number;
  pais?: string;
}

export type IInstructorInput = Omit<IInstructor, '_id'>;
