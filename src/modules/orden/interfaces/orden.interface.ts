// orden/interfaces/orden.interface.ts

import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICursosItemOrden {
  cursoId: Types.ObjectId;
  precio?: number;
  courseTitle?: string;
  descuento?: number;
}

export interface IOrden extends IdInterface {
  _id: Types.ObjectId;
  usuarioId?: Types.ObjectId;
  listaCursos: Array<ICursosItemOrden>;
  montoTotal?: number;
  estado_orden?: EstadoOrden;
}

export type IOrdenInput = Omit<IOrden, '_id' | 'fechaCreacion'>;
