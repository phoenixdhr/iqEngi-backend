import { InputType, Field } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsDate,
  IsArray,
  IsMobilePhone,
} from 'class-validator';
import { IPerfil } from '../../interfaces/perfil.interface';

@InputType()
export class CreatePerfilInput implements IPerfil {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @Field({ nullable: true })
  @IsMobilePhone()
  @IsOptional()
  @IsString()
  celular?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  fechaNacimiento?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contacto?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intereses?: string[];
}
