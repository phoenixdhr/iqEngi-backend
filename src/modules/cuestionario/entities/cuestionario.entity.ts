import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { Pregunta, PreguntaSchema } from './pregunta.entity';
import { ICuestionario } from '../interfaces/cuestionario.interface';
import { Coleccion } from 'src/common/enums';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

// #region Cuestionario
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Cuestionario extends AuditFields implements ICuestionario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Curso, required: true })
  cursoId: Types.ObjectId;

  @Field({ nullable: true })
  @Prop()
  cuestionarioTitle?: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field(() => [Pregunta], { nullable: true })
  @Prop({ type: [PreguntaSchema], default: [] })
  preguntas: Pregunta[];

  @Field(() => Int, { nullable: true })
  @Prop()
  numeroPreguntasPresentar?: number;

  @Field({ nullable: true })
  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}
export const CuestionarioSchema = SchemaFactory.createForClass(Cuestionario);

CuestionarioSchema.index({ cursoId: 1 }, { unique: true });
CuestionarioSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Cuestionario, Cuestionario>(CuestionarioSchema);
