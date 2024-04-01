type Id = string;

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

enum RolUsuario {
  Estudiante = 'estudiante',
  Instructor = 'instructor',
  Editor = 'editor',
  Administrador = 'administrador',
}

enum EstadoAccesoCurso {
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

interface CursoComprado {
  cursoId: Curso['_id'];
  fechaCompra: Date;
  estadoAcceso: EstadoAccesoCurso;
}

interface ProgresoId {
  progresoCursoId: ProgresoCurso['_id'];
  cursoId: Curso['_id'];
}

//ENTIDAD
export class ProgresoCurso {
  _id: Id;
  cursoId: Curso['_id'];
  usuarioId: Usuario['_id'];
  evaluacionUsuario?: CuestionarioRespuestaUsuario['_id'][]; // Inicialmente podría estar vacío hasta que el usuario comience a resolver cuestionarios
  progresoTotal: number; // Podría empezar en 0, indicando que no han avanzado aún en el curso
}

export enum nivel {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',
}

//ENTIDAD
export class Curso {
  _id: Id;
  title: string;
  descripcionCorta: string;
  nivel: nivel;
  instructor: InstructorCurso;
  duracionHoras: number;
  imagenURL?: string; // Opcional, podría tener una imagen por defecto
  precio: number;
  descuentos?: number; // Opcional, no todos los cursos podrían tener descuentos
  calificacion?: number; // Opcional, inicialmente podría no tener calificación
  aprenderas?: string[]; // Opcional, pero recomendado
  objetivos?: string[]; // Opcional, pero recomendado
  dirigidoA?: string[]; // Opcional, pero recomendado
  contenido?: EstructuraProgramaria[]; // Opcional, pero crítico para el desarrollo del curso
  fechaLanzamiento?: Date;
  categoriaIds: Categoria['_id'][]; // Requerido, debe categorizarse desde el inicio
}

interface InstructorCurso {
  instructorId: Instructor['_id'];
  nombre: string;
  apellidos: string;
  profesion?: string; // Opcional, podría no ser relevante para todos los casos
  especializacion?: string[]; // Opcional, puede que no todos los instructores tengan especializaciones
}

//ENTIDAD
export class Instructor {
  _id: Id;
  nombre: string;
  apellidos: string;
  profesion?: string; // Opcional
  especializacion?: string[]; // Opcional
  calificacionPromedio?: number; // Opcional, puede que inicialmente no tengan calificaciones
  pais?: string; // Opcional
}

interface EstructuraProgramaria {
  modulo: number;
  titleModulo: string;
  unidades?: UnidadEducativa[]; // Opcional, podrían definirse más adelante
}

interface UnidadEducativa {
  unidad: number;
  title: string;
  temas?: string[]; // Opcional, podría detallarse más adelante
  idCuestionario?: Cuestionario['_id']; // Opcional, puede que algunas unidades no tengan cuestionarios asociados
}

//ENTIDAD
export class Comentario {
  _id: Id;
  cursoId: Curso['_id'];
  usuarioId: Usuario['_id'];
  comentario: string;
  calificacion?: number;
  fecha: Date;
}

//ENTIDAD
export class Categoria {
  _id: Id;
  nombre: string;
  descripcion?: string; // Opcional, puede que algunas categorías sean autoexplicativas
}

enum EstadoOrden {
  Pendiente = 'pendiente',
  Procesando = 'procesando',
  Completada = 'completada',
  Cancelada = 'cancelada',
  Reembolsada = 'reembolsada',
}

//ENTIDAD
export class Orden {
  _id: Id;
  usuarioId: Usuario['_id'];
  cursos: Curso['_id'][];
  fechaCompra: Date;
  montoTotal: number;
  estado: EstadoOrden;
}

//ENTIDAD
export class Cuestionario {
  _id: Id;
  cursoId: Curso['_id'];
  titulo?: string;
  descripcion?: string;
  preguntas: Pregunta[];
  fecha?: Date;
}

export interface Pregunta {
  _id: Id;
  texto: string;
  tipo: TipoPregunta;
  opciones: Opciones[];
  respuestaCorrecta?: Opciones['_id'] | Opciones['_id'][]; // Opcional, algunas preguntas podrían diseñarse para discusión o práctica sin una respuesta "correcta"
}

export interface Opciones {
  _id: Id;
  texto: string;
  esCorrecta?: boolean;
}

// Define los posibles tipos de preguntas que pueden existir en el sistema.
export enum TipoPregunta {
  Abierta = 'abierta',
  Alternativa = 'alternativa',
  Opcion_multiple = 'opcion_multiple',
  Verdadero_falso = 'verdadero_falso',
  Ordenamiento = 'ordenamiento',
}

//ENTIDAD
export class CuestionarioRespuestaUsuario {
  _id: Id;
  usuarioId: Usuario['_id'];
  modulo: number;
  unidad: number;
  cuestionarioId: Cuestionario['_id'];
  respuestas: RespuestaUsuario[];
  fechaRespuesta: Date;
  nota?: number;
  estado?: EstadoCuestionario;
}

export enum EstadoCuestionario {
  Aprobado = 'aprobado',
  Desaprobado = 'desaprobado',
  En_progreso = 'en_progreso',
  Sin_empezar = 'sin_empezar',
}

export interface RespuestaUsuario {
  preguntaId: Pregunta['_id'];
  respuesta: Opciones['_id'] | Opciones['_id'][];
}

export type Cursos = Array<Curso>;
