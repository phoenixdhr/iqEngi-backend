import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsDate,
  IsMongoId,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

import { OmitType, PartialType } from '@nestjs/swagger';
import {
  Opcion,
  Pregunta,
  TipoPregunta,
} from '../entities/cuestionario.entity';
import { Type } from 'class-transformer';

// #region OpcionDTO
export class CreateOpcionDto {
  @IsString()
  readonly texto: string;

  @IsInt()
  @Min(0) // Acepta números mayores o iguales a 0
  readonly esCorrecta: number;
}

export class UpdateOpcionDto extends PartialType(CreateOpcionDto) {}

// #region PreguntaDTO
export class CreatePreguntaDto {
  @IsString()
  readonly enunciado: string;

  @IsEnum(TipoPregunta)
  readonly tipo: TipoPregunta;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  @IsOptional()
  readonly opciones?: Opcion[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID
}

export class UpdatePreguntaDto extends PartialType(CreatePreguntaDto) {}

// #region CuestionarioDto
export class CreateCuestionarioAllDto {
  // @IsMongoId()
  // @IsString()
  // readonly cursoId: string;

  @IsString()
  readonly titulo: string;

  @IsString()
  readonly descripcion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDto)
  @IsOptional()
  readonly preguntas?: Pregunta[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID

  @IsDate()
  @IsOptional()
  readonly fecha?: Date;

  @IsMongoId()
  readonly unidadEducativaId: string;
}

export class CreateCuestionarioDto extends PartialType(
  OmitType(CreateCuestionarioAllDto, ['unidadEducativaId']),
) {}

export class UpdateCuestionarioDto extends PartialType(CreateCuestionarioDto) {}
