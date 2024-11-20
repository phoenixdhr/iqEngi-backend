// respuesta-cuestionario/interfaces/respuesta-cuestionario.interface.ts

import { Types } from 'mongoose';
import { EstadoCuestionario } from 'src/common/enums/estado-cuestionario.enum';
import { IRespuestaPregunta } from './respuesta-pregunta.interface';
import { CreateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/create-respuesta-pregunta.dto';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IRespuestaCuestionario extends IdInterface {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  cuestionarioId: Types.ObjectId;
  respuestas: IRespuestaPregunta[];
  fecha: Date;
  nota?: number;
  estado?: EstadoCuestionario;
}

export type IRespuestaCuestionarioInput = Omit<
  IRespuestaCuestionario,
  'fecha' | '_id' | 'respuestas'
> & {
  respuestas: CreateRespuestaPreguntaInput[];
};
