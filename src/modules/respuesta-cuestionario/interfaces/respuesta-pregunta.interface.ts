// respuesta-cuestionario/interfaces/respuesta-pregunta.interface.ts

import { Types } from 'mongoose';
import { TipoPregunta } from 'src/common/enums';
import { IdInterface } from 'src/common/interfaces/id.interface';
import { IRespuestaData } from './repuestaData.interface';
// import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';

export interface IRespuestaPregunta extends IdInterface {
  _id: Types.ObjectId;
  preguntaId: Types.ObjectId;
  respuestaId?: IRespuestaData[];
  tipoPregunta?: TipoPregunta; // O el enum TipoPregunta

  respuestaAbierta?: string;
  esCorrecto?: boolean;
}

export type IRespuestaPreguntaInput = Omit<IRespuestaPregunta, '_id'>;
