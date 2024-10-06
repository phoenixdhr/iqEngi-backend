import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';
import { Pregunta } from 'src/modules/cuestionario/entities/pregunta.entity';
import { IRespuestaPregunta } from '../interfaces/respuesta-pregunta.interface';
import { Document } from 'mongoose';

// #region RespuestaUsuario

// 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
@ObjectType()
@Schema()
export class RespuestaPregunta extends Document implements IRespuestaPregunta {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Pregunta)
  @Prop({ type: Types.ObjectId, ref: Pregunta.name, required: true })
  preguntaId: Types.ObjectId;

  @Field(() => [Opcion], { nullable: true })
  @Prop({ type: [Types.ObjectId], ref: Opcion.name })
  opcionIds?: Types.ObjectId[];

  @Field({ nullable: true })
  @Prop()
  respuestaAbierta?: string;
}

export const RespuestaPreguntaUsuarioSchema =
  SchemaFactory.createForClass(RespuestaPregunta);
