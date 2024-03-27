import {
  IsArray,
  // IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
  ArrayNotEmpty, // Importación añadida
  IsDateString, // Importación añadida
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import type { Id } from './id'; // Asegurando el uso de Id

enum Nivel {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',
}

class instructorCurso {
  @IsString() // Considerar validar que es un Id válido si tienes un formato específico en mente.
  readonly instructorId: Id; // Conservando el uso de Id como estaba originalmente

  @IsString()
  readonly nombre: string;

  @IsString()
  readonly apellidos: string;

  @IsString()
  readonly profesion: string;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty() // Asegura que el array no esté vacío
  readonly especializacion?: string[];
}

class EstructuraProgramariaDto {
  @IsNumber()
  readonly modulo: number;

  @IsString()
  readonly titleModulo: string;

  @ValidateNested({ each: true })
  @Type(() => UnidadEducativaDto)
  @IsArray()
  @ArrayNotEmpty() // Asegura que el array no esté vacío
  readonly unidades: UnidadEducativaDto[];
}

class UnidadEducativaDto {
  @IsString()
  readonly title: string;

  @IsArray()
  @ArrayNotEmpty() // Asegura que el array no esté vacío
  readonly temas: string[];
}

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly descripcionCorta: string;

  @IsEnum(Nivel)
  readonly nivel: Nivel;

  @ValidateNested({ each: true })
  @Type(() => instructorCurso)
  @IsOptional() // Se hace opcional para permitir la creación de cursos sin instructor definido.
  readonly instructor?: instructorCurso;

  @IsNumber()
  @Min(0)
  readonly duracionHoras: number;

  @IsString()
  @IsUrl()
  readonly imagenURL: string;

  @IsNumber()
  @Min(0)
  @IsOptional() // Hecho opcional, un curso puede no tener precio inicialmente.
  readonly precio?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional() // Hecho opcional, puede no haber descuentos inicialmente.
  readonly descuentos?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional() // Hecho opcional, un curso nuevo puede no tener calificación.
  readonly calificacion?: number;

  @IsArray()
  @IsOptional() // Asegura que estos campos puedan ser opcionales.
  readonly aprenderas?: string[];

  @IsArray()
  @IsOptional() // Asegura que estos campos puedan ser opcionales.
  readonly objetivos?: string[];

  @IsArray()
  @IsOptional() // Asegura que estos campos puedan ser opcionales.
  readonly dirigidoA?: string[];

  @ValidateNested({ each: true })
  @Type(() => EstructuraProgramariaDto)
  @IsArray()
  @IsOptional() // Permite la creación de cursos sin contenido definido.
  readonly contenido?: EstructuraProgramariaDto[];

  @IsOptional()
  @IsDateString() // Asegura que la fecha sea un string de fecha válido.
  readonly fechaLanzamiento?: Date;

  @IsArray()
  @IsOptional() // Permite cursos sin categorías asignadas.
  readonly categoriaIds?: Id[]; // Conservando el uso de Id
}

// Las mismas mejoras y principios de opcionalidad y validación específica se aplican a UpdateCursoDto, manteniendo la consistencia y claridad en el código.

export class UpdateCursoDto extends PartialType(CreateCursoDto) {}
