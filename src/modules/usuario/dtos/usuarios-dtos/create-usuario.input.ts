import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUrl,
  MinLength,
} from 'class-validator';

import { CreatePerfilInput } from '../perfil-dtos/create-perfil.input';
import { Type } from 'class-transformer';
import { IUsuarioInput } from '../../interfaces/usuario.interface';
import { UserGoogle } from 'src/modules/auth/interfaces/google-user.interface';

@InputType()
export class CreateUsuarioInput implements IUsuarioInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

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
