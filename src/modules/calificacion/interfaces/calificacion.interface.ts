// calificacion/interfaces/calificacion.interface.ts

import { Types } from 'mongoose';

export interface ICalificacion {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  valor: number;
  comentario?: string;
  fecha: Date;
}

export type ICalificacionInput = Omit<ICalificacion, 'fecha' | '_id'>;
