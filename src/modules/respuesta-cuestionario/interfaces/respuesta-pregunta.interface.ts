// respuesta-cuestionario/interfaces/respuesta-pregunta.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';
import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';

export interface IRespuestaPregunta extends IdInterface {
  _id: Types.ObjectId;
  preguntaId: Types.ObjectId;
  respuestaId?: Types.ObjectId[] | Opcion[];
  // respuestaAbierta?: string;
}

export type IRespuestaPreguntaInput = Omit<IRespuestaPregunta, '_id'>;
