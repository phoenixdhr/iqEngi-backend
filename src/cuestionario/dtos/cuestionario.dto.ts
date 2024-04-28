import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  // ValidateNested,
  IsDate,
  IsMongoId,
  Allow,
  IsNumber,
} from 'class-validator';
// import { Type } from 'class-transformer';
import { PartialType, OmitType } from '@nestjs/swagger';
import { TipoPregunta } from '../entities/cuestionario.entity';
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
  readonly preguntas: Types.ObjectId[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID

  // @IsArray()
  // @Allow() // Permite la validación de tipos mixtos
  // @ValidateNested({ each: true })
  // @Type(() => PreguntaDto)
  // @IsMongoId({ each: true, always: false })
  // readonly preguntas: Types.ObjectId[] | PreguntaDto[]; // Aceptar tanto IDs como objetos completos

  @IsDate()
  @IsOptional()
  readonly fecha?: Date;
}

export class PreguntaDto {
  @IsString()
  readonly enunciado: string;

  @IsEnum(TipoPregunta)
  readonly tipo: TipoPregunta;

  // @IsArray()
  // @Allow() // Permite la validación de tipos mixtos
  // @ValidateNested({ each: true })
  // @Type(() => OpcionDto)
  // @IsMongoId({ each: true, always: false })
  // readonly opciones: Types.ObjectId[] | OpcionDto[]; // Aceptar tanto IDs como objetos completos

  @IsArray()
  @IsMongoId({ each: true })
  readonly opciones: Types.ObjectId[]; // Ajusta según la necesidad de aceptar múltiples IDs o un solo ID
}

export class OpcionDto {
  @IsString()
  readonly texto: string;

  // PARA REVISAR SI ES PSOBILE VALIDAR BOOLEANOS Y NUMÉRICOS
  @Allow() // Permite cualquier valor validado por más de una regla
  @IsBoolean({ always: false })
  @IsNumber({}, { always: false })
  readonly esCorrecta: boolean | number; // Aceptar valores booleanos o numéricos

  // @IsOptional()
  // @IsBoolean()
  // readonly esCorrecta?: boolean | number;
}

export class UpdateCuestionarioDto extends PartialType(
  OmitType(CreateCuestionarioDto, ['cursoId', 'preguntas']),
) {}
