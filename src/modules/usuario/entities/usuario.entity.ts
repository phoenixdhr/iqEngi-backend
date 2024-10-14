import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackError, Document, Query, Types } from 'mongoose';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Perfil, PerfilSchema } from './perfil.entity';
import { RolEnum } from 'src/common/enums/rol.enum';
import { IUsuario } from '../interfaces/usuario.interface';
import { UserStatus } from 'src/common/enums/estado-usuario.enum';
import { Coleccion } from 'src/common/enums';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
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

  @Prop({ nullable: true })
  hashPassword?: string;

  @Prop({ default: false })
  isGoogleAuth?: boolean;

  @Field(() => [RolEnum])
  @Prop({
    type: [String],
    enum: RolEnum,
    required: true,
    default: [RolEnum.ESTUDIANTE],
  })
  roles: [RolEnum];

  @Field({ nullable: true })
  @Prop()
  picture?: string;

  @Field(() => Perfil, { nullable: true })
  @Prop({ type: PerfilSchema })
  perfil?: Perfil;

  @Field()
  @Prop({ default: true })
  notificaciones: boolean;

  // Nuevo campo 'status' para representar el estado del usuario
  @Field(() => UserStatus)
  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    required: true,
  })
  status: UserStatus;

  // Campo opcional para registrar cuándo fue eliminado
  @Field({ nullable: true })
  @Prop({ default: null })
  deletedAt?: Date;

  // Opcional: quién eliminó al usuario
  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario, default: null })
  deletedBy?: Types.ObjectId;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índice para asegurar unicidad en email
UsuarioSchema.index({ email: 1 }, { unique: true });

// Índice para optimizar consultas que filtran por status
UsuarioSchema.index({ status: 1 });

// #region Middleware
// Middleware para excluir usuarios eliminados en consultas de búsqueda
UsuarioSchema.pre(
  /^find/,
  function (
    this: Query<UsuarioOutput | UsuarioOutput[], Usuario>,
    next: (err?: CallbackError) => void,
  ) {
    // 'this' hace referencia a la consulta
    this.where({ status: { $ne: UserStatus.DELETED } });
    next();
  },
);
