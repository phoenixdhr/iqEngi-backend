import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Perfil, PerfilSchema } from './perfil.entity';
import { RolEnum } from 'src/common/enums/rol.enum';
import { IUsuario } from '../interfaces/usuario.interface';
import { UserStatus } from 'src/common/enums/estado-usuario.enum';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';
import { IsOptional } from 'class-validator';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { Coleccion } from 'src/common/enums';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Usuario extends AuditFields implements IUsuario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ nullable: true })
  @Prop()
  firstName?: string;

  @Field({ nullable: true })
  @Prop()
  lastName?: string;

  @Field()
  @Prop({ required: true, lowercase: true })
  email: string;

  @Field()
  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ nullable: true })
  hashPassword?: string;

  @Field()
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

  @Field(() => [Curso], { nullable: true })
  @Prop({
    type: [{ type: Types.ObjectId, ref: Coleccion.Curso }],
    default: [],
  })
  cursosFavoritos?: Types.ObjectId[];

  @Field(() => UserStatus)
  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Field()
  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: undefined })
  @IsOptional()
  resetPasswordToken?: string;

  @Prop({ default: null })
  @IsOptional()
  resetPasswordExpires?: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índice para asegurar unicidad en email
UsuarioSchema.index({ email: 1 }, { unique: true });
UsuarioSchema.index({ status: 1 });
UsuarioSchema.index({ deleted: 1 });

// #region Middleware
addSoftDeleteMiddleware<UsuarioOutput, Usuario>(UsuarioSchema);
