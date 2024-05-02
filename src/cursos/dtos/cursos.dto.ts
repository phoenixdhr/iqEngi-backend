import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  IsMongoId,
  IsDate,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Nivel } from '../entities/curso.entity';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcionCorta: string;

  @IsEnum(Nivel)
  @IsOptional()
  readonly nivel?: Nivel;

  @IsMongoId()
  @IsOptional()
  readonly instructor?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly duracionHoras?: number;

  @IsUrl()
  @IsOptional()
  readonly imagenURL?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly precio?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly descuentos?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  readonly calificacion?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly aprenderas?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly objetivos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly dirigidoA?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly estructuraProgramaria?: string[];

  // @IsDateString()
  @IsDate()
  @IsOptional()
  readonly fechaLanzamiento?: Date;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly categorias: string[];
}

// Las mismas mejoras y principios de opcionalidad y validación específica se aplican a UpdateCursoDto, manteniendo la consistencia y claridad en el código.

export class UpdateCursoDto extends PartialType(CreateCursoDto) {}
