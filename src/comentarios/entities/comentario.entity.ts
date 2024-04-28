import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Id } from '../../_common/dtos/id';
import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

//ENTIDAD
export class Comentario {
  _id: Id;
  cursoId: Curso['_id'];
  usuarioId: Usuario['_id'];
  comentario: string;
  calificacion?: number;
  fecha: Date;
}
