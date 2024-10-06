// respuesta-cuestionario/interfaces/respuesta-pregunta.interface.ts

import { Types } from 'mongoose';

export interface IRespuestaPregunta {
  _id: Types.ObjectId;
  preguntaId: Types.ObjectId;
  opcionIds?: Types.ObjectId[];
  respuestaAbierta?: string;
}

export type IRespuestaPreguntaInput = Omit<IRespuestaPregunta, '_id'>;
