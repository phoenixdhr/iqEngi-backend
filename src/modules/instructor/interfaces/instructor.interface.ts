// instructor/interfaces/instructor.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IInstructor extends IdInterface {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  profesion?: string;
  especializacion?: string[];
  calificacionPromedio?: number;
  pais?: string;
}

export type IInstructorInput = Omit<IInstructor, '_id'>;
