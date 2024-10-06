// unidad.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Eliminamos la importación de Modulo
import { Material, MaterialSchema } from './material.entity';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IUnidad } from '../interfaces/unidad.interface';
import { Coleccion } from 'src/common/enums';

@ObjectType()
@Schema()
export class Unidad extends Document implements IUnidad {
  @Field(() => ID)
  _id: Types.ObjectId;

  // Usamos ID en lugar de Modulo y referencia como cadena de texto
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Coleccion.Modulo, required: true })
  moduloId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true })
  numeroUnidad: number;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field({ nullable: true })
  @Prop()
  urlVideo?: string;

  @Field(() => [Material], { nullable: true })
  @Prop({ type: [MaterialSchema], default: [] })
  materiales?: Material[];
}

export const UnidadSchema = SchemaFactory.createForClass(Unidad);

UnidadSchema.index({ moduloId: 1, numeroUnidad: 1 }, { unique: true });
