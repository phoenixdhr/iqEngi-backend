// import { Id } from '../../_common/dtos/id';
// import { Curso } from '../../cursos/entities/curso.entity';
// import { Usuario } from '../../usuarios/entities/usuario.entity';

// //ENTIDAD
// export class Comentario {
//   _id: Id;
//   cursoId: Curso['_id'];
//   usuarioId: Usuario['_id'];
//   comentario: string;
//   calificacion?: number;
//   fecha: Date;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

//ENTIDAD
@Schema()
export class Comentario extends Document {
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Prop({ required: true })
  comentario: string;

  @Prop()
  calificacion?: number;

  @Prop({ required: true })
  fecha: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
