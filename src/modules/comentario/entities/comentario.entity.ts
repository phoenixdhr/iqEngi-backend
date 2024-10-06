// comentario.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IComentario } from '../interfaces/comentario.interface';

@ObjectType()
@Schema()
export class Comentario extends Document implements IComentario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => Curso)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  comentario: string;

  @Field()
  @Prop({ default: Date.now })
  fecha: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);

ComentarioSchema.index({ cursoId: 1 });
