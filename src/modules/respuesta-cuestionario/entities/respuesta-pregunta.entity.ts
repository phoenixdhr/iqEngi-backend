import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Pregunta } from 'src/modules/cuestionario/entities/pregunta.entity';
import { IRespuestaPregunta } from '../interfaces/respuesta-pregunta.interface';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { TipoPregunta } from 'src/common/enums';
import { RespuestaData, RespuestaDataSchema } from './respuestaData.entity';

// 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class RespuestaPregunta
  extends AuditFields
  implements IRespuestaPregunta
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Pregunta.name, required: true })
  preguntaId: Types.ObjectId;

  @Field(() => [RespuestaData], { nullable: true })
  @Prop({ type: [RespuestaDataSchema] }) // Ahora Mongoose reconocerá el esquema
  respuestaId?: RespuestaData[];

  @Field(() => TipoPregunta, { nullable: true })
  @Prop({ required: true, enum: TipoPregunta })
  tipoPregunta: TipoPregunta;

  @Field(() => String, { nullable: true })
  @Prop()
  respuestaAbierta?: string;

  @Field()
  @Prop({ default: false })
  deleted: boolean;

  @Field()
  @Prop({ default: false })
  esCorrecto: boolean;
}

export const RespuestaPreguntaUsuarioSchema =
  SchemaFactory.createForClass(RespuestaPregunta);

RespuestaPreguntaUsuarioSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<RespuestaPregunta, RespuestaPregunta>(
  RespuestaPreguntaUsuarioSchema,
);
