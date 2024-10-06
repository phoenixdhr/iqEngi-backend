// material.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IMaterial } from '../interfaces/material.interface';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema()
export class Material extends Document implements IMaterial {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field()
  @Prop({ required: true })
  url: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
