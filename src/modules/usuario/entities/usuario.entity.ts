import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Perfil, PerfilSchema } from './perfil.entity';
import { RolEnum } from 'src/common/enums/rol.enum';
import { IUsuario } from '../interfaces/usuario.interface';
import { Types } from 'mongoose';

// #region Usuario
@ObjectType()
@Schema()
export class Usuario extends Document implements IUsuario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ required: true })
  hashPassword?: string;

  @Field(() => [RolEnum])
  @Prop({
    type: [String],
    enum: RolEnum,
    required: true,
  })
  roles: RolEnum[];

  @Field({ nullable: true })
  @Prop()
  picture?: string;

  @Field(() => Perfil, { nullable: true })
  @Prop({ type: PerfilSchema })
  perfil?: Perfil;

  @Field()
  @Prop({ default: true })
  notificaciones: boolean;

  @Field()
  @Prop({ default: true })
  isActive: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
