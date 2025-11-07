import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';

@InputType()
export class CrearContactoDto {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @Field()
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  empresa?: string;

  @Field()
  @IsNotEmpty({ message: 'El motivo es requerido' })
  @IsString()
  motivo: string;

  @Field()
  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @IsString()
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  mensaje: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  newsletter: boolean;
}
