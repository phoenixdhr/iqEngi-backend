// orden/interfaces/orden.interface.ts

import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';

export interface ICursosOrden {
  cursoId: Types.ObjectId;
  precio: number;
}

export interface IOrden {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursos: Array<ICursosOrden>;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  montoTotal?: number;
  estado?: EstadoOrden;
}

export type IOrdenInput = Omit<IOrden, '_id' | 'fechaCreacion'>;
