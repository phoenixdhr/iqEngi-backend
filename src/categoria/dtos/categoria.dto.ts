import { IsString, IsOptional } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @ApiProperty()
  readonly nombre: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  @ApiProperty()
  readonly descripcion?: string;
}

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
