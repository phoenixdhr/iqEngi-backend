// curso-comprado/interfaces/curso-comprado.interface.ts

import { Types } from 'mongoose';
import { EstadoAccesoCurso } from 'src/common/enums/estado-acceso-curso.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICursoComprado extends IdInterface {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursoId: Types.ObjectId;
  tituloCurso: string;
  fechaCompra?: Date;
  fechaExpiracion?: Date;
  estadoAcceso?: EstadoAccesoCurso;
  progreso?: number;
  cursoCompletado?: boolean;
  ultimaNota?: number;
}

export type ICursoCompradoInput = Omit<
  ICursoComprado,
  '_id' | 'fechaCompra' | 'fechaExpiracion' | 'tituloCurso'
>;

// export interface ICursoCompradoInput {
//   usuarioId: Types.ObjectId;
//   cursoId: Types.ObjectId;
// }
