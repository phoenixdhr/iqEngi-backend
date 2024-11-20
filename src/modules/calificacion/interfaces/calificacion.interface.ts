// calificacion/interfaces/calificacion.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICalificacion extends IdInterface {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  valor: number;
  comentario?: string;
  fecha: Date;
  deleted: boolean;
}

export type ICalificacionInput = Omit<
  ICalificacion,
  'fecha' | '_id' | 'deleted'
>;
