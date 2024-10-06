import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ICategoria } from '../interfaces/categoria.interface';

@ObjectType()
@Schema()
export class Categoria extends Document implements ICategoria {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true, unique: true })
  nombre: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
