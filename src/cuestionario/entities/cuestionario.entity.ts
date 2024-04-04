import type { Id } from '../../_common/dtos/id';
import { Curso } from '../../cursos/entities/curso.entity';

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
