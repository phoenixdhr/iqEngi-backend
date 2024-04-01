import type { Id } from '../../common/dtos/id';
import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';
import { Pregunta } from '../../cuestionario/entities/cuestionario.entity';
import { Opciones } from '../../cuestionario/entities/cuestionario.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

// 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
export class CuestionarioRespuestaUsuario {
  _id: Id; // Identificador único para las respuestas de un usuario a un cuestionario.
  usuarioId: Usuario['_id']; // Identificador del usuario que respondió al cuestionario.
  modulo: number;
  unidad: number;
  cuestionarioId: Cuestionario['_id']; // Identificador del cuestionario que fue respondido.
  respuestas: RespuestaUsuario[]; // Array de respuestas dadas por el usuario.
  fechaRespuesta: Date; // Fecha en la que se respondió el cuestionario.
  nota?: number; // Nota obtenida por el usuario en el cuestionario.
  estado?: EstadoCuestionario; // Estado de la respuesta del cuestionario (completado, pendiente, etc.).
}

export enum EstadoCuestionario {
  Aprobado = 'aprobado',
  Desaprobado = 'desaprobado',
  En_progreso = 'en_progreso',
  Sin_empezar = 'sin_empezar',
}

// 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
export interface RespuestaUsuario {
  preguntaId: Pregunta['_id']; // Identificador de la pregunta a la que se responde.
  respuesta: Opciones['_id'] | Opciones['_id'][]; // Igualmente, especifica que las respuestas deben ser los IDs de las opciones.
}
