import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoriaDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  readonly nombre: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  readonly descripcion?: string;
}

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
