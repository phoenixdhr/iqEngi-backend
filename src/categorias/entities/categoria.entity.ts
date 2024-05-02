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
