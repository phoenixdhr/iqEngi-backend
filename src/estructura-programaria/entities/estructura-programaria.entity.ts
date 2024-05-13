import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';
import { Entidades } from '../../_common/nameEntidaes';

// #region UnidadEducativa
@Schema()
export class UnidadEducativa extends Document {
  @Prop({ unique: true, required: true })
  unidad: number;

  @Prop({ required: true })
  title: string;

  @Prop({ default: [] })
  temas: Types.Array<string>;

  @Prop({ type: Types.ObjectId, ref: Cuestionario.name })
  idCuestionario?: Types.ObjectId; // Opcional, al inicio las unidades no tienen un cuestionarios asociados

  @Prop({
    type: Types.ObjectId,
    ref: Entidades.EstructuraProgramaria,
    required: true,
    index: true,
  })
  idEstructuraProgramaria: Types.ObjectId;
}

export const UnidadEducativaSchema =
  SchemaFactory.createForClass(UnidadEducativa);

// #region EstructuraProgramaria
@Schema()
export class EstructuraProgramaria extends Document {
  @Prop({ type: Types.ObjectId, ref: Entidades.Curso, required: true })
  cursoId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  modulo: number;

  @Prop({ required: true })
  titleModulo: string;

  @Prop({ type: [UnidadEducativaSchema], default: [] })
  unidades: Types.DocumentArray<UnidadEducativa>;
}

export const EstructuraProgramariaSchema = SchemaFactory.createForClass(
  EstructuraProgramaria,
);
