// comentario/interfaces/comentario.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IComentario extends IdInterface {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  comentario: string;
  fecha: Date;
}

export type IComentarioInput = Omit<IComentario, 'fecha' | '_id'>;
