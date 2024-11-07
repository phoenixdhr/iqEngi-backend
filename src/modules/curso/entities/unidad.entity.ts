import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Eliminamos la importación de Modulo
import { Material, MaterialSchema } from './material.entity';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IUnidad } from '../interfaces/unidad.interface';
import { Coleccion } from 'src/common/enums';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { DocumentStatus } from 'src/common/enums/estado-documento';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Unidad
  extends Document
  implements IUnidad, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  // Usamos ID en lugar de Modulo y referencia como cadena de texto
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Coleccion.Modulo, required: true })
  moduloId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true })
  numeroUnidad: number;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  @Field({ nullable: true })
  @Prop()
  urlVideo?: string;

  @Field(() => [Material], { nullable: true })
  @Prop({ type: [MaterialSchema], default: [] })
  materiales?: Material[];

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

export const UnidadSchema = SchemaFactory.createForClass(Unidad);

UnidadSchema.index({ moduloId: 1, numeroUnidad: 1 }, { unique: true });
