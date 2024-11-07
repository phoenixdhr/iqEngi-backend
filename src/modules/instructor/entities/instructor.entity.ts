import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IInstructor } from '../interfaces/instructor.interface';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// #region Instructores
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Instructor
  extends Document
  implements IInstructor, CreatedUpdatedDeletedBy
{
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

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  createdBy?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  updatedBy?: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ default: null })
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario, default: null })
  deletedBy?: Types.ObjectId;

  @Field(() => DocumentStatus)
  @Prop({
    type: String,
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
