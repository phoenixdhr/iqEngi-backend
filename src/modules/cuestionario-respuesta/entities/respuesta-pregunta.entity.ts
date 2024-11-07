import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';
import { Pregunta } from 'src/modules/cuestionario/entities/pregunta.entity';
import { IRespuestaPregunta } from '../interfaces/respuesta-pregunta.interface';
import { Document } from 'mongoose';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class RespuestaPregunta
  extends Document
  implements IRespuestaPregunta, CreatedUpdatedDeletedBy
{
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

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  createdBy?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  updatedBy?: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ default: null })
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario, default: null })
  deletedBy?: Types.ObjectId;

  @Field(() => DocumentStatus)
  @Prop({
    type: String,
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;
}

export const RespuestaPreguntaUsuarioSchema =
  SchemaFactory.createForClass(RespuestaPregunta);

RespuestaPreguntaUsuarioSchema.index({ status: 1 });
