import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';
import { Pregunta } from '../../cuestionario/entities/cuestionario.entity';
import { Opcion } from '../../cuestionario/entities/cuestionario.entity';
import { Entidades } from '../../_common/nameEntidaes';
import { UnidadEducativa } from 'src/estructura-programaria/entities/estructura-programaria.entity';

export enum EstadoCuestionario {
  Aprobado = 'aprobado',
  Desaprobado = 'desaprobado',
  En_progreso = 'en_progreso',
  Sin_empezar = 'sin_empezar',
}

// #region RespuestaUsuario
// 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
@Schema()
export class RespuestaUsuario extends Document {
  @Prop({ type: Types.ObjectId, ref: Pregunta.name, required: true })
  preguntaId: Types.ObjectId; // Identificador de la pregunta a la que se responde.

  @Prop({ type: [Types.ObjectId], ref: Opcion.name, required: true })
  respuesta: Types.Array<Opcion> | Types.Array<Types.ObjectId>; // Igualmente, especifica que las respuestas deben ser los IDs de las opciones.
}

export const RespuestaUsuarioSchema =
  SchemaFactory.createForClass(RespuestaUsuario);

// #region CuestionarioRespuesta
// 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
@Schema()
export class CuestionarioRespuestaUsuario extends Document {
  @Prop({ type: Types.ObjectId, ref: Entidades.Usuario, required: true })
  usuarioId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId; // sera extraido de Cuestionario usando CuestionarioId, y se agregara al DTo correspondiente antes de ser guardado.

  @Prop({ type: Types.ObjectId, ref: UnidadEducativa.name, required: true })
  unidadEducativaId: Types.ObjectId; // sera extraido de Cuestionario usando CuestionarioId, y se agregara al DTo correspondiente antes de ser guardado.

  @Prop({ type: Types.ObjectId, ref: Cuestionario.name, required: true })
  cuestionarioId: Types.ObjectId;

  @Prop({
    type: [RespuestaUsuarioSchema],
    default: [],
  })
  respuestas: Types.Array<RespuestaUsuario>;

  @Prop()
  fechaRespuesta?: Date; // FECHA EN LA QUE SE EVALUÓ EL CUESTIONARIO , CON EstadoCuestionario = "Aprobado" o "Desaprobado

  @Prop()
  nota?: number; // SE CALCULA EN BASE A LAS RESPUESTAS DADAS POR EL USUARIO

  @Prop({ default: EstadoCuestionario.Sin_empezar })
  estado?: EstadoCuestionario;
}

export const CuestionarioRespuestaUsuarioSchema = SchemaFactory.createForClass(
  CuestionarioRespuestaUsuario,
);
