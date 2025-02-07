// respuesta-cuestionario/interfaces/respuesta-pregunta.interface.ts

import { Types } from 'mongoose';
// import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';

export interface IRespuestaData {
  _id?: Types.ObjectId;
  textOpcion?: string;
  orden?: number;
  respuestaAbierta?: string; // O el enum TipoPregunta
}

export type IRespuestaDataInput = Omit<IRespuestaData, '_id'>;
