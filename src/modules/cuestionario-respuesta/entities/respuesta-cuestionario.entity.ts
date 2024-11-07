import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../curso/entities/curso.entity';
import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';

import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {
  RespuestaPregunta,
  RespuestaPreguntaUsuarioSchema,
} from './respuesta-pregunta.entity';
import { EstadoCuestionario } from 'src/common/enums/estado-cuestionario.enum';
import { IRespuestaCuestionario } from '../interfaces/respuesta-cuestionario.interface';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
@ObjectType()
export class RespuestaCuestionario
  extends Document
  implements IRespuestaCuestionario, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => Curso)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId; // sera extraido de Cuestionario usando CuestionarioId, y se agregara al DTo correspondiente antes de ser guardado.

  @Field(() => Cuestionario)
  @Prop({ type: Types.ObjectId, ref: Cuestionario.name, required: true })
  cuestionarioId: Types.ObjectId;

  @Field(() => [RespuestaPregunta])
  @Prop({ type: [RespuestaPreguntaUsuarioSchema], required: true })
  respuestas: RespuestaPregunta[];

  @Field()
  @Prop({ default: Date.now })
  fecha: Date;

  @Field(() => Float, { nullable: true })
  @Prop()
  nota?: number;

  @Field()
  @Prop({ enum: EstadoCuestionario, required: true })
  estado: EstadoCuestionario;

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

export const RespuestaCuestionarioSchema = SchemaFactory.createForClass(
  RespuestaCuestionario,
);

RespuestaCuestionarioSchema.index(
  { usuarioId: 1, cursoId: 1, cuestionarioId: 1 },
  { unique: true },
);

RespuestaCuestionarioSchema.index({ status: 1 });
