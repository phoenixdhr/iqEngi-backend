import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IInstructor } from '../interfaces/instructor.interface';

// #region Instructores
@ObjectType()
@Schema()
export class Instructor extends Document implements IInstructor {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field({ nullable: true })
  @Prop()
  profesion?: string;

  @Field(() => [String])
  @Prop({ default: [] })
  especializacion: string[];

  @Field(() => Float)
  @Prop({ default: 0 })
  calificacionPromedio: number;

  @Field({ nullable: true })
  @Prop()
  pais?: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
