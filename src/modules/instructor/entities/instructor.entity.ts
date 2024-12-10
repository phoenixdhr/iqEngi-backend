import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IInstructor } from '../interfaces/instructor.interface';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

// #region Instructores
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Instructor extends AuditFields implements IInstructor {
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

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);

InstructorSchema.index({ deleted: 1 });
InstructorSchema.index(
  { firstName: 'text', lastName: 'text' },
  { unique: true },
);

addSoftDeleteMiddleware<Instructor, Instructor>(InstructorSchema);
