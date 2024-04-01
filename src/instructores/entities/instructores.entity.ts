import type { Id } from '../../common/dtos/id';

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
