// modulo.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Eliminamos la importación de Unidad
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IModulo } from '../interfaces/modulo.interface';
import { Coleccion } from 'src/common/enums';
import { Unidad } from './unidad.entity';

@ObjectType()
@Schema()
export class Modulo extends Document implements IModulo {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Coleccion.Curso, required: true })
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true })
  numeroModulo: number;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  // Usamos IDs para las unidades y referenciamos como cadena de texto
  @Field(() => [Unidad], { nullable: true })
  @Prop({ type: [Types.ObjectId], ref: Coleccion.Unidad, default: [] })
  unidades?: Types.ObjectId[];
}

export const ModuloSchema = SchemaFactory.createForClass(Modulo);

ModuloSchema.index({ cursoId: 1, numeroModulo: 1 }, { unique: true });
