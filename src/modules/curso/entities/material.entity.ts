import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IMaterial } from '../interfaces/material.interface';
import { Types } from 'mongoose';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Material extends AuditFields implements IMaterial {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
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

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

MaterialSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Material, Material>(MaterialSchema);
