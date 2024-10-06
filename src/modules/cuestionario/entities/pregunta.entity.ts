import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
import { Opcion, OpcionSchema } from './opcion.entity';
import { Types } from 'mongoose';
import { Modulo } from 'src/modules/curso/entities/modulo.entity';
import { Unidad } from 'src/modules/curso/entities/unidad.entity';
import { IPregunta } from '../interfaces/pregunta.interface';
import { Document } from 'mongoose';

// #region Pregunta
@ObjectType()
@Schema()
export class Pregunta extends Document implements IPregunta {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  enunciado: string;

  @Field(() => TipoPregunta)
  @Prop({ required: true, enum: TipoPregunta })
  tipoPregunta: TipoPregunta;

  @Field(() => [Opcion], { nullable: true })
  @Prop({ type: [OpcionSchema], default: [] })
  opciones?: Opcion[];

  @Field(() => Modulo, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Modulo.name })
  moduloId?: Types.ObjectId;

  @Field(() => Unidad, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Unidad.name })
  unidadId?: Types.ObjectId;
}

export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);
