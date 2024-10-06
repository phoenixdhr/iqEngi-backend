import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerfil } from '../interfaces/perfil.interface';
import { Document } from 'mongoose';

// #region Perfil
@ObjectType()
@Schema()
export class Perfil extends Document implements IPerfil {
  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field({ nullable: true })
  @Prop()
  ubicacion?: string;

  @Field({ nullable: true })
  @Prop()
  celular?: string;

  @Field({ nullable: true })
  @Prop()
  fechaNacimiento?: Date;

  @Field({ nullable: true })
  @Prop()
  contacto?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  intereses?: string[];
}
export const PerfilSchema = SchemaFactory.createForClass(Perfil);
