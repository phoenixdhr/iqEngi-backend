// curso-comprado/interfaces/curso-comprado.interface.ts

import { Types } from 'mongoose';
import { EstadoAccesoCurso } from 'src/common/enums/estado-acceso-curso.enum';

export interface ICursoComprado extends ICursoCompradoInput {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  fechaCompra: Date;
  fechaExpiracion?: Date;
  estadoAcceso: EstadoAccesoCurso;
  progreso: number;
  cursoCompletado: boolean;
}

// export type ICursoCompradoInput = Omit<
//   ICursoComprado,
//   '_id' | 'fechaCompra' | 'fechaExpiracion'
// >;

export interface ICursoCompradoInput {
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
}
