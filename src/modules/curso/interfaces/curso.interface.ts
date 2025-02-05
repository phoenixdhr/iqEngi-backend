import { Types } from 'mongoose';
import { Nivel } from 'src/common/enums/nivel.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface ICurso extends IdInterface {
  _id: Types.ObjectId;
  courseTitle: string;
  descripcionCorta: string;
  descripcionLarga?: string;
  nivel?: Nivel;
  instructor?: Types.ObjectId;
  duracionHoras?: number;
  imagenURL?: string;
  precio?: number;
  currency?: string;
  descuentos?: number;
  aprenderas?: string[];
  objetivos?: string[];
  dirigidoA?: string[];

  modulosIds?: Types.ObjectId[];

  fechaLanzamiento?: Date;
  categorias?: Types.ObjectId[];
  calificacionPromedio?: number;
  numeroCalificaciones?: number;
  cuestionarioId?: Types.ObjectId;
}

export type ICursoInput = Omit<
  ICurso,
  '_id' | 'calificacionPromedio' | 'numeroCalificaciones'
>;
