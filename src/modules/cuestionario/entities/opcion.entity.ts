import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOpcion } from '../interfaces/opcion.interface';
import { Types } from 'mongoose';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

// #region Opcion
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Opcion extends AuditFields implements IOpcion {
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

OpcionSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Opcion, Opcion>(OpcionSchema);
