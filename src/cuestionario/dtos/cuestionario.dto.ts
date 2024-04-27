import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  // ValidateNested,
  IsDate,
  IsMongoId,
} from 'class-validator';
// import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { TipoPregunta } from '../entities/cuestionario.entity';
// import { Opciones } from '../entities/cuestionario.entity';
// import { Curso } from 'src/cursos/entities/curso.entity';
// import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

export class CreateCuestionarioDto {
  @IsString()
  readonly cursoId: Types.ObjectId;

  @IsOptional()
  @IsString()
  readonly titulo?: string;

  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @IsArray()
  @IsMongoId({ each: true })
  readonly preguntas: Types.ObjectId[] | PreguntaDto[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => PreguntaDto)
  // readonly preguntas: PreguntaDto[];

  @IsDate()
  @IsOptional()
  readonly fecha?: Date;
}

export class PreguntaDto {
  @IsString()
  readonly enunciado: string;

  @IsEnum(TipoPregunta)
  readonly tipo: TipoPregunta;

  @IsArray()
  @IsMongoId({ each: true })
  readonly opciones: Types.ObjectId[] | OpcionDto[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => OpcionDto)
  // readonly opciones: OpcionDto[];

  // @IsArray()
  // @ValidateNested({ each: true })
  // readonly opciones: OpcionDto[];

  // @IsOptional()
  // @IsArray()
  // readonly respuestaCorrecta?: Opciones['_id'] | Opciones['_id'][]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID
}

export class OpcionDto {
  @IsString()
  readonly texto: string;

  @IsOptional()
  @IsBoolean()
  readonly esCorrecta?: boolean | number;
}

export class UpdateCuestionarioDto extends PartialType(CreateCuestionarioDto) {}
