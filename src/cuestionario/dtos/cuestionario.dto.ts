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

import { PartialType } from '@nestjs/swagger';
import {
  Opcion,
  Pregunta,
  TipoPregunta,
} from '../entities/cuestionario.entity';
import { Type } from 'class-transformer';

export class OpcionDto {
  @IsString()
  readonly texto: string;

  @IsInt()
  @Min(0) // Acepta números mayores o iguales a 0
  readonly esCorrecta: number;
}

export class PreguntaDto {
  @IsString()
  readonly enunciado: string;

  @IsEnum(TipoPregunta)
  readonly tipo: TipoPregunta;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpcionDto)
  @IsOptional()
  readonly opciones?: Opcion[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID
}

export class CreateCuestionarioDto {
  @IsMongoId()
  @IsString()
  readonly cursoId: string;

  @IsString()
  readonly titulo: string;

  @IsString()
  readonly descripcion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreguntaDto)
  @IsOptional()
  readonly preguntas?: Pregunta[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID

  @IsDate()
  @IsOptional()
  readonly fecha?: Date;

  @IsMongoId()
  readonly unidadEducativaId: string;
}

export class UpdateCuestionarioDto extends PartialType(CreateCuestionarioDto) {}
