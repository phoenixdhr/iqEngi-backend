// src/common/classes/audit-fields.class.ts

import { Field, ID } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Coleccion } from '../enums';
import { CreatedUpdatedDeletedBy } from '../interfaces/created-updated-deleted-by.interface';

export abstract class AuditFields
  extends Document
  implements CreatedUpdatedDeletedBy
{
  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario })
  createdBy?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario })
  updatedBy?: Types.ObjectId;

  @Field()
  @Prop({ default: false })
  deleted: boolean;

  @Field({ nullable: true })
  @Prop({ default: null })
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario, default: null })
  deletedBy?: Types.ObjectId;
}
