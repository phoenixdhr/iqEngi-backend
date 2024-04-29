import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';

export enum Nivel {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',
}

@Schema()
class UnidadEducativa {
  @Prop()
  unidad: number;

  @Prop()
  title: string;

  @Prop()
  temas?: string[];

  @Prop({ type: Types.ObjectId, ref: Cuestionario.name })
  idCuestionario?: Types.ObjectId | Cuestionario; // Opcional, puede que algunas unidades no tengan cuestionarios asociados
}
export const UnidadEducativaSchema =
  SchemaFactory.createForClass(UnidadEducativa);

@Schema()
export class EstructuraProgramaria extends Document {
  @Prop()
  modulo: number;

  @Prop()
  titleModulo: string;

  @Prop({ type: [UnidadEducativaSchema], default: [] })
  unidades?: Types.Array<UnidadEducativa>;
}

export const EstructuraProgramariaSchema = SchemaFactory.createForClass(
  EstructuraProgramaria,
);
