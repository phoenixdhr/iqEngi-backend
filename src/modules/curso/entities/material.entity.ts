import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IMaterial } from '../interfaces/material.interface';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Material extends Document implements IMaterial {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  materialTitle: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field()
  @Prop({ required: true })
  url: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
