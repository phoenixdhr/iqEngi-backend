import { Curso } from '../../cursos/entities/curso.entity';
import { Id } from '../../common/dtos/id';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CuestionarioRespuestaUsuario } from '../../cuestionario-respuesta-usuario/entities/cuestionario-respuesta-usuario.entity';

//ENTIDAD
export class ProgresoCurso {
  _id: Id;
  cursoId: Curso['_id'];
  usuarioId: Usuario['_id'];
  evaluacionUsuario?: CuestionarioRespuestaUsuario['_id'][]; // Inicialmente podría estar vacío hasta que el usuario comience a resolver cuestionarios
  progresoTotal: number; // Podría empezar en 0, indicando que no han avanzado aún en el curso
}
