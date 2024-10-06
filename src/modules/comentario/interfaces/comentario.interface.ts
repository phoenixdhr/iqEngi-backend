// comentario/interfaces/comentario.interface.ts

import { Types } from 'mongoose';

export interface IComentario {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  comentario: string;
  fecha: Date;
}

export type IComentarioInput = Omit<IComentario, 'fecha' | '_id'>;
