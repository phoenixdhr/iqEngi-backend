import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

// 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
@ObjectType()
export class RespuestaCuestionario
  extends AuditFields
  implements IRespuestaCuestionario
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId; // sera extraido de Cuestionario usando CuestionarioId, y se agregara al DTo correspondiente antes de ser guardado.

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Cuestionario.name, required: true })
  cuestionarioId: Types.ObjectId;

  @Field(() => [RespuestaPregunta], { nullable: true })
  @Prop({ type: [RespuestaPreguntaUsuarioSchema], default: [] })
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

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const RespuestaCuestionarioSchema = SchemaFactory.createForClass(
  RespuestaCuestionario,
);

// RespuestaCuestionarioSchema.index(
//   { usuarioId: 1, cursoId: 1, cuestionarioId: 1 },
//   { unique: true },
// );

RespuestaCuestionarioSchema.index(
  { usuarioId: 1, cursoId: 1, cuestionarioId: 1 },
  { unique: true, partialFilterExpression: { deleted: false } },
);

RespuestaCuestionarioSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<RespuestaCuestionario, RespuestaCuestionario>(
  RespuestaCuestionarioSchema,
);
