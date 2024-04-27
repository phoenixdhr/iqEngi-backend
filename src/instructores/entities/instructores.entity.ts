import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// import type { Id } from '../../_common/dtos/id';

//ENTIDAD
@Schema({ collection: 'Instructores' })
export class Instructores extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop()
  profesion?: string; // Opcional

  @Prop()
  especializacion?: string[]; // Opcional

  @Prop()
  calificacionPromedio?: number; // Opcional, puede que inicialmente no tengan calificaciones

  @Prop()
  pais?: string; // Opcional
}

export const InstructorSchema = SchemaFactory.createForClass(Instructores);
