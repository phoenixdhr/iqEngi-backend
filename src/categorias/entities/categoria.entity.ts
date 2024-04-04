import type { Id } from '../../_common/dtos/id';

//ENTIDAD
export class Categoria {
  _id: Id;
  nombre: string;
  descripcion?: string; // Opcional, puede que algunas categorías sean autoexplicativas
}
