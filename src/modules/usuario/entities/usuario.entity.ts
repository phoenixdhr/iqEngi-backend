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

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Usuario extends AuditFields implements IUsuario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true, lowercase: true })
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

  @Prop({ default: undefined })
  @IsOptional()
  resetPasswordToken?: string;

  @Prop({ default: null })
  @IsOptional()
  resetPasswordExpires?: Date;

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
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índice para asegurar unicidad en email
UsuarioSchema.index({ email: 1 }, { unique: true });
UsuarioSchema.index({ status: 1 });
UsuarioSchema.index({ deleted: 1 });

// #region Middleware
addSoftDeleteMiddleware<UsuarioOutput, Usuario>(UsuarioSchema);
// // Middleware para excluir usuarios eliminados en consultas de búsqueda
// UsuarioSchema.pre(
//   /^find/,
//   function (
//     this: Query<UsuarioOutput | UsuarioOutput[], Usuario>,
//     next: (err?: CallbackError) => void,
//   ) {
//     // 'this' hace referencia a la consulta
//     this.where({ deleted: { $ne: true } });
//     next();
//   },
// );
