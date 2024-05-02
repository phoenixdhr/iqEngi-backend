import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

//ENTIDAD
@Schema({ collection: 'Instructores' })
export class Instructores extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop()
  profesion?: string; // Opcional

  @Prop({ default: [] })
  especializacion: Types.Array<string>; // Opcional

  @Prop()
  calificacionPromedio?: number; // Opcional, puede que inicialmente no tengan calificaciones

  @Prop()
  pais?: string; // Opcional
}

export const InstructorSchema = SchemaFactory.createForClass(Instructores);
