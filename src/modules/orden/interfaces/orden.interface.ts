// orden/interfaces/orden.interface.ts

import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICursosOrden {
  cursoId: Types.ObjectId;
  precio: number;
}

export interface IOrden extends IdInterface {
  _id: Types.ObjectId;
  usuarioId: Types.ObjectId;
  cursos: Array<ICursosOrden>;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  montoTotal?: number;
  estado_orden?: EstadoOrden;
}

export type IOrdenInput = Omit<IOrden, '_id' | 'fechaCreacion'>;
