import { Types } from 'mongoose';
import { Nivel } from 'src/common/enums/nivel.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';
import { IImage } from 'src/common/interfaces/iImage';

export interface ICurso extends IdInterface {
  _id: Types.ObjectId;
  courseTitle: string;
  descripcionCorta: string;
  descripcionLarga?: string;
  nivel?: Nivel;
  instructor?: Types.ObjectId;
  duracionHoras?: number;
  imagenURL?: IImage;
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
  slug?: string;
}

export type ICursoInput = Omit<
  ICurso,
  '_id' | 'calificacionPromedio' | 'numeroCalificaciones'
>;
