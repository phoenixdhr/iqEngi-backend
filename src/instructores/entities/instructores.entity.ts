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
  profesion?: string;

  @Prop({ default: [] })
  especializacion: Types.Array<string>;

  // #region definir
  @Prop()
  calificacionPromedio?: number; // Opcional, se pide encuesta al terminar el curso

  @Prop()
  pais?: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructores);
