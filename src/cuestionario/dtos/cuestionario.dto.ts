import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { Opciones, TipoPregunta } from '../entities/cuestionario.entity';
import { Curso } from 'src/cursos/entities/curso.entity';

export class CreateCuestionarioDto {
  @IsString()
  readonly cursoId: Curso['_id'];

  @IsOptional()
  @IsString()
  readonly titulo?: string;

  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreguntaDto)
  readonly preguntas: PreguntaDto[];

  @IsDate()
  @IsOptional()
  readonly fecha: Date;
}

export class PreguntaDto {
  @IsString()
  readonly texto: string;

  @IsEnum(TipoPregunta)
  readonly tipo: TipoPregunta;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpcionDto)
  readonly opciones: OpcionDto[];

  @IsOptional()
  @IsArray()
  readonly respuestaCorrecta?: Opciones['_id'] | Opciones['_id'][]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID
}

export class OpcionDto {
  @IsString()
  readonly texto: string;

  @IsOptional()
  @IsBoolean()
  readonly esCorrecta?: boolean;
}

export class UpdateCuestionarioDto extends PartialType(CreateCuestionarioDto) {}
