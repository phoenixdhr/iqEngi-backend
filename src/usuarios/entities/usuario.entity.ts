import type { Id } from '../../_common/dtos/id';
import { Curso } from '../../cursos/entities/curso.entity';
import { ProgresoCurso } from '../../progreso-cursos/entities/progreso-curso.entity';
// type id = string; // Cambiado a string para reflejar el uso de MongoDB ObjectId.

//ENTIDAD
export class Usuario {
  _id: Id;
  nombre: string;
  apellidos: string;
  email: string;
  hashContraseña: string;
  rol: RolUsuario[];
  perfil?: Perfil; // Opcional, puede completarse después del registro inicial
  cursos_comprados_historial?: CursoComprado[]; // Opcional, inicialmente vacío hasta que compren cursos
  curso_progreso?: ProgresoId[]; // Opcional, inicialmente vacío hasta que comiencen un curso
}

export enum RolUsuario {
  Estudiante = 'estudiante',
  Instructor = 'instructor',
  Editor = 'editor',
  Administrador = 'administrador',
}

export enum EstadoAccesoCurso {
  Activo = 'activo',
  Inactivo = 'inactivo',
}

interface Perfil {
  bio?: string; // Opcional
  ubicacion?: string; // Opcional
  imagenURL?: string; // Opcional
  contacto?: string; // Opcional
  intereses?: string[]; // Opcional
}

export interface CursoComprado {
  cursoId: Curso['_id'];
  fechaCompra: Date;
  estadoAcceso: EstadoAccesoCurso;
}

export interface ProgresoId {
  progresoCursoId: ProgresoCurso['_id'];
  cursoId: Curso['_id'];
}
