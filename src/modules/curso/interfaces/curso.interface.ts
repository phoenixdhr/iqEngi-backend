import { Types } from 'mongoose';
import { Nivel } from 'src/common/enums/nivel.enum';

export interface ICurso {
  _id: Types.ObjectId;

  titulo: string;
  descripcionCorta: string;
  descripcionLarga?: string;
  nivel?: Nivel;
  instructor?: Types.ObjectId;
  duracionHoras?: number;
  imagenURL?: string;
  precio?: number;
  descuentos?: number;
  aprenderas?: string[];
  objetivos?: string[];
  dirigidoA?: string[];
  modulos?: Types.ObjectId[];
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
