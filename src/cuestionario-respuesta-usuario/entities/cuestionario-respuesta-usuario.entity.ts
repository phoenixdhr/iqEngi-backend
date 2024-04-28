// import { Curso } from 'src/cursos/entities/curso.entity';
// import type { Id } from '../../_common/dtos/id';
// import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';
// import { Pregunta } from '../../cuestionario/entities/cuestionario.entity';
// import { Opciones } from '../../cuestionario/entities/cuestionario.entity';
// import { Usuario } from '../../usuarios/entities/usuario.entity';

// // 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
// export class CuestionarioRespuestaUsuario {
//   _id: Id; // Identificador único para las respuestas de un usuario a un cuestionario.
//   usuarioId: Usuario['_id']; // Identificador del usuario que respondió al cuestionario.
//   cursoId: Curso['_id']; // Identificador del curso al que pertenece el cuestionario.
//   modulo: number;
//   unidad: number;
//   cuestionarioId: Cuestionario['_id']; // Identificador del cuestionario que fue respondido.
//   respuestas: RespuestaUsuario[]; // Array de respuestas dadas por el usuario.
//   fechaRespuesta: Date; // Fecha en la que se respondió el cuestionario.
//   nota?: number; // Nota obtenida por el usuario en el cuestionario.
//   estado?: EstadoCuestionario; // Estado de la respuesta del cuestionario (completado, pendiente, etc.).
// }

// export enum EstadoCuestionario {
//   Aprobado = 'aprobado',
//   Desaprobado = 'desaprobado',
//   En_progreso = 'en_progreso',
//   Sin_empezar = 'sin_empezar',
// }

// // 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
// export interface RespuestaUsuario {
//   preguntaId: Pregunta['_id']; // Identificador de la pregunta a la que se responde.
//   respuesta: Opciones['_id'] | Opciones['_id'][]; // Igualmente, especifica que las respuestas deben ser los IDs de las opciones.
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from 'src/cursos/entities/curso.entity';
import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';
import { Pregunta } from '../../cuestionario/entities/cuestionario.entity';
import { Opciones } from '../../cuestionario/entities/cuestionario.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoCuestionario {
  Aprobado = 'aprobado',
  Desaprobado = 'desaprobado',
  En_progreso = 'en_progreso',
  Sin_empezar = 'sin_empezar',
}

// 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
@Schema()
export class RespuestaUsuario extends Document {
  @Prop({ type: Types.ObjectId, ref: Pregunta.name, required: true })
  preguntaId: Types.ObjectId; // Identificador de la pregunta a la que se responde.

  @Prop({ type: [Types.ObjectId], ref: Opciones.name, default: [] })
  respuesta: Types.Array<Opciones>; // Igualmente, especifica que las respuestas deben ser los IDs de las opciones.
}

export const RespuestaUsuarioSchema =
  SchemaFactory.createForClass(RespuestaUsuario);

// 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
@Schema()
export class CuestionarioRespuestaUsuario extends Document {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Prop({ required: true })
  modulo: number;

  @Prop({ required: true })
  unidad: number;

  @Prop({ type: Types.ObjectId, ref: Cuestionario.name, required: true })
  cuestionarioId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: RespuestaUsuario.name, default: [] })
  respuestas: Types.Array<RespuestaUsuario>;

  @Prop()
  fechaRespuesta: Date;

  @Prop()
  nota?: number;

  @Prop()
  estado?: EstadoCuestionario;
}

export const CuestionarioRespuestaUsuarioSchema = SchemaFactory.createForClass(
  CuestionarioRespuestaUsuario,
);
