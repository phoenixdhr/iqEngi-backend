import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IMaterial } from '../interfaces/material.interface';
import { Document, Types } from 'mongoose';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Material
  extends Document
  implements IMaterial, CreatedUpdatedDeletedBy
{
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

export const MaterialSchema = SchemaFactory.createForClass(Material);
