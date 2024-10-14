// usuario/dtos/create-usuario.input.ts

import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUrl,
} from 'class-validator';

import { CreatePerfilInput } from '../perfil-dtos/create-perfil.input';
import { Type } from 'class-transformer';
import { IUsuarioInput } from '../../interfaces/usuario.interface';
import { UserGoogle } from 'src/modules/auth/interfaces/google-user.interface';

@InputType()
export class CreateUsuarioInput implements IUsuarioInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @Field({ nullable: true })
  // @IsOptional()
  // @IsBoolean()
  // email_verified: boolean = false;

  // @Field({ defaultValue: false })
  // @IsOptional()
  // @IsBoolean()
  // isGoogleAuth?: boolean = false;

  @Field()
  @IsString()
  password: string;

  // @Field(() => [RolEnum])
  // @IsArray()
  // @IsEnum(RolEnum, { each: true })
  // @ArrayUnique()
  // roles: RolEnum[] = [RolEnum.ESTUDIANTE]; // Valor por defecto

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  picture?: string;

  @Field(() => CreatePerfilInput, { nullable: true })
  @IsOptional()
  @Type(() => CreatePerfilInput)
  perfil: CreatePerfilInput;

  @Field(() => Boolean, { nullable: true })
  @IsNotEmpty()
  @IsBoolean()
  notificaciones: boolean = true;

  // @Field(() => UserStatus, { nullable: true })
  // @IsEnum(UserStatus)
  // @IsOptional()
  // status: UserStatus = UserStatus.ACTIVE;
}

export class CreateUserGoogleAuth implements UserGoogle {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  email_verified: boolean = true;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  picture?: string;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isGoogleAuth?: boolean;
}
