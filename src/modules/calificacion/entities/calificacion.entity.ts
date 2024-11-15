// calificacion.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ICalificacion } from '../interfaces/calificacion.interface';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Calificacion extends AuditFields implements ICalificacion {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => Curso)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true, min: 1, max: 5 })
  valor: number;

  @Field({ nullable: true })
  @Prop()
  comentario?: string;

  @Field()
  @Prop({ default: Date.now })
  fecha: Date;
}

export const CalificacionSchema = SchemaFactory.createForClass(Calificacion);

CalificacionSchema.index({ usuarioId: 1, cursoId: 1 }, { unique: true });
CalificacionSchema.index({ status: 1 });
CalificacionSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Calificacion, Calificacion>(CalificacionSchema);
