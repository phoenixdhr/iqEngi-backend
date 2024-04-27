// Definiciones de tipos básicos permanecen sin cambios.
export type Aprenderas = string[];
export type Objetivos = string[];
export type CompromisosEducativos = string[];

import type { Id } from '../../_common/dtos/id';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';
import { Instructores } from '../../instructores/entities/instructores.entity';

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
  instructorId: Instructores['_id'];
  nombre: string;
  apellidos: string;
  profesion?: string; // Opcional, podría no ser relevante para todos los casos
  especializacion?: string[]; // Opcional, puede que no todos los instructores tengan especializaciones
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

export type Cursos = Array<Curso>;
