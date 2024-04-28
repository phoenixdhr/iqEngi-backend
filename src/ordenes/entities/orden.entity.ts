import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import type { Id } from '../../_common/dtos/id';
import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoOrden {
  Pendiente = 'pendiente',
  Procesando = 'procesando',
  Completada = 'completada',
  Cancelada = 'cancelada',
  Reembolsada = 'reembolsada',
}

//ENTIDAD
export class Orden {
  _id: Id;
  usuarioId: Usuario['_id'];
  cursos: Curso['_id'][];
  fechaCompra: Date;
  montoTotal: number;
  estado: EstadoOrden;
}
