import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Eliminamos la importación de Unidad
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IModulo } from '../interfaces/modulo.interface';
import { Coleccion } from 'src/common/enums';
import { Unidad } from './unidad.entity';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { DocumentStatus } from 'src/common/enums/estado-documento';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Modulo
  extends Document
  implements IModulo, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Coleccion.Curso, required: true })
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true })
  numeroModulo: number;

  @Field()
  @Prop({ required: true })
  titulo: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  // Usamos IDs para las unidades y referenciamos como cadena de texto
  @Field(() => [Unidad], { nullable: true })
  @Prop({ type: [Types.ObjectId], ref: Coleccion.Unidad, default: [] })
  unidades?: Types.ObjectId[];

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

export const ModuloSchema = SchemaFactory.createForClass(Modulo);

ModuloSchema.index({ cursoId: 1, numeroModulo: 1 }, { unique: true });
