import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOpcion } from '../interfaces/opcion.interface';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

// #region Opcion
@ObjectType()
@Schema()
export class Opcion extends Document implements IOpcion {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  textOpcion: string;

  @Field()
  @Prop({ required: true })
  esCorrecta: boolean;

  @Field(() => Int, { nullable: true })
  @Prop()
  orden?: number;
}

export const OpcionSchema = SchemaFactory.createForClass(Opcion);
