import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  Opcion,
  OpcionSchema,
} from 'src/modules/cuestionario/entities/opcion.entity';
import { Pregunta } from 'src/modules/cuestionario/entities/pregunta.entity';
import { IRespuestaPregunta } from '../interfaces/respuesta-pregunta.interface';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

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

  @Field(() => [Opcion], { nullable: true })
  @Prop({ type: [OpcionSchema], default: [] })
  respuestaId?: Opcion[];

  @Field(() => String, { nullable: true })
  @Prop()
  respuestaAbierta?: string;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const RespuestaPreguntaUsuarioSchema =
  SchemaFactory.createForClass(RespuestaPregunta);

RespuestaPreguntaUsuarioSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<RespuestaPregunta, RespuestaPregunta>(
  RespuestaPreguntaUsuarioSchema,
);
