// orden/interfaces/orden.interface.ts

import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

// Interfaz que define la estructura de cada curso dentro de una orden
export interface ICursosItemOrden {
  cursoId: Types.ObjectId;
  precio?: number;
  courseTitle?: string;
  descuento?: number;
  // Moneda en la que se registró el precio del curso (código ISO 4217)
  currency?: string;
}

// Interfaz principal de la orden de compra
export interface IOrden extends IdInterface {
  _id: Types.ObjectId;
  usuarioId?: Types.ObjectId;
  listaCursos: Array<ICursosItemOrden>;
  montoTotal?: number;
  estado_orden?: EstadoOrden;
  // Moneda en la que se realizó la transacción (código ISO 4217)
  currency?: string;
}

export type IOrdenInput = Omit<IOrden, '_id' | 'fechaCreacion'>;
