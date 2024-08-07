import { Types } from 'mongoose';
import { Nivel } from './curso.entity';
import { Instructores } from 'src/instructores/entities/instructores.entity';
import { EstructuraProgramaria } from 'src/estructura-programaria/entities/estructura-programaria.entity';

export interface ICurso {
  title: string;
  descripcionCorta: string;
  nivel?: Nivel;
  instructor?: Types.ObjectId | Instructores;
  duracionHoras?: number;
  imagenURL?: string;
  precio?: number;
  descuentos?: number;
  calificacion?: number;
  aprenderas: string[];
  objetivos: string[];
  dirigidoA: string[];
  estructuraProgramaria:
    | Types.Array<Types.ObjectId>
    | Types.DocumentArray<EstructuraProgramaria>;
  fechaLanzamiento?: Date;
  categorias?: Types.Array<Types.ObjectId>;
}
