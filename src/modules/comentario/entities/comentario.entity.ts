import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IComentario } from '../interfaces/comentario.interface';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { AuditFields } from 'src/common/clases/audit-fields.class';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Comentario extends AuditFields implements IComentario {
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

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);

ComentarioSchema.index({ cursoId: 1 });
ComentarioSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Comentario, Comentario>(ComentarioSchema);
