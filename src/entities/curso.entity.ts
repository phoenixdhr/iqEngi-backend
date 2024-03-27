// Definiciones de tipos básicos permanecen sin cambios.
export type Aprenderas = string[];
export type Objetivos = string[];
export type Especializacion = string[];
export type CompromisosEducativos = string[];

type id = string; // Cambiado a string para reflejar el uso de MongoDB ObjectId.

export interface Usuario {
  _id: id;
  nombre: string;
  apellidos: string;
  email: string;
  hashContraseña: string; // Ajuste de nombre para mantener consistencia
  rol: RolUsuario[]; // Suponiendo que los roles sean representados por strings
  perfil: Perfil;
  cursos_comprados_historial: CursoComprado[]; // Ajustado según la descripción
  curso_progreso: id[]; //id de Cursos
}

type RolUsuario = 'estudiante' | 'instructor' | 'editor' | 'administrador';
type EstadoAccesoCurso = 'activo' | 'inactivo';

interface Perfil {
  bio: string;
  ubicacion: string;
  imagenURL: string;
  contacto: string;
  intereses: string[];
}

interface CursoComprado {
  cursoId: id;
  fechaCompra: Date;
  estadoAcceso: EstadoAccesoCurso;
}

export interface ProgresoCurso {
  _id: id;
  usuarioId: id;
  cursoId: id;
  modulosCompletados: number[]; // Cambiado a reflejar IDs de módulos
  examenesEvaluacionesPasadas: boolean[];
  progresoTotal: number;
}

type nivel = 'Principiante' | 'Intermedio' | 'Avanzado';

export class Curso {
  _id: id;
  title: string;
  descripcionCorta: string;
  nivel: nivel;
  instructor: InstructorCurso = {
    instructorId: '',
    nombre: '',
    apellidos: '',
    profesion: '',
    especializacion: [],
  };
  duracionHoras: number;
  imagenURL: string;
  precio: number;
  descuentos?: number;
  calificacion: number;
  aprenderas: Aprenderas;
  objetivos: Objetivos;
  dirigidoA: string[];
  contenido: EstructuraProgramaria[];
  fechaLanzamiento: Date;
  categoriaIds: id[];
}

// InstructorCurso y Instructor usan informacion duplicada
interface InstructorCurso {
  instructorId: id;
  nombre: string;
  apellidos: string;
  profesion: string;
  especializacion: Especializacion;
}

export interface Instructor {
  _id: id;
  nombre: string;
  apellidos: string;
  profesion: string;
  especializacion: Especializacion;
  calificacionPromedio: number;
  pais: string;
}

interface EstructuraProgramaria {
  modulo: number;
  titleModulo: string;
  unidades: UnidadEducativa[];
}

interface UnidadEducativa {
  title: string;
  temas: string[];
}

export interface Testimonio {
  _id: id;
  cursoId: id;
  usuarioId: id;
  comentario: string;
  calificacion: number;
  fecha: Date;
}

export interface Categoria {
  _id: id;
  nombre: string;
  descripcion?: string;
}

export const categoriasUnicas: Categoria[] = [];

type EstadoOrden =
  | 'pendiente'
  | 'procesando'
  | 'completada'
  | 'cancelada'
  | 'reembolsada';

export interface Orden {
  _id: id;
  usuarioId: id;
  cursos: id[];
  fechaCompra: Date;
  montoTotal: number;
  estado: EstadoOrden;
}

export type Cursos = Array<Curso>;
