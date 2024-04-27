// import type { Id } from '../../_common/dtos/id';

// //ENTIDAD
// export class Categoria {
//   _id: Id;
//   nombre: string;
//   descripcion?: string; // Opcional, puede que algunas categorías sean autoexplicativas
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Categorias' })
export class Categoria extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion?: string; // Opcional, puede que algunas categorías sean autoexplicativas
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
