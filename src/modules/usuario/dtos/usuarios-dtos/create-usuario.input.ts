// usuario/dtos/create-usuario.input.ts

import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayUnique,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { RolEnum } from 'src/common/enums/rol.enum';

import { CreatePerfilInput } from '../perfil-dtos/create-perfil.input';
import { Type } from 'class-transformer';
import { IUsuarioInput } from '../../interfaces/usuario.interface';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  email_verified: boolean = false;

  @Field()
  @IsString()
  password: string;

  @Field(() => [RolEnum])
  @IsArray()
  @IsEnum(RolEnum, { each: true })
  @ArrayUnique()
  roles: RolEnum[] = [RolEnum.ESTUDIANTE]; // Valor por defecto

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

  @Field(() => Boolean, { nullable: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean = true;
}
