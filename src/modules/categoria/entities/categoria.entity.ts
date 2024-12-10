import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ICategoria } from '../interfaces/categoria.interface';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Categoria extends AuditFields implements ICategoria {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true, unique: true })
  nombreCategoria: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);

CategoriaSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Categoria, Categoria>(CategoriaSchema);
