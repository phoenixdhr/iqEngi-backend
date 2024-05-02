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

  @Prop({ default: () => new Date() })
  fecha: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
