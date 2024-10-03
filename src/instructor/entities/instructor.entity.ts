import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// #region Instructores
@Schema({ collection: 'Instructores' })
export class Instructor extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  profesion?: string;

  @Prop({ default: [] })
  especializacion: Types.Array<string>;

  @Prop()
  calificacionPromedio?: number; // Opcional, se pide encuesta al terminar el curso

  @Prop()
  pais?: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
