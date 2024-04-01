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
  // ArrayNotEmpty, // Importación añadida
  IsDateString, // Importación añadida
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import type { Id } from '../../common/dtos/id'; // Asegurando el uso de Id
import { Cuestionario } from 'src/cuestionario/entities/cuestionario.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

enum Nivel {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',
}

class InstructorCursoDto {
  @IsString()
  readonly instructorId: Id;

  @IsString()
  readonly nombre: string;

  @IsString()
  readonly apellidos: string;

  @IsString()
  @IsOptional()
  readonly profesion?: string;

  @IsArray()
  @IsOptional()
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
  @IsOptional() // Ahora es opcional para reflejar la posibilidad de que no estén definidas al principio.
  readonly unidades?: UnidadEducativaDto[];
}

class UnidadEducativaDto {
  @IsNumber()
  readonly unidad: number;

  @IsString()
  readonly title: string;

  @IsArray()
  @IsOptional() // Temas puede ser opcional.
  readonly temas?: string[];

  @IsArray()
  @IsOptional() // idCuestionario puede ser opcional.
  readonly idCuestionario?: Cuestionario['_id'];
}

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly descripcionCorta: string;

  @IsEnum(Nivel)
  readonly nivel: Nivel;

  @ValidateNested()
  @Type(() => InstructorCursoDto)
  @IsOptional()
  readonly instructor?: InstructorCursoDto;

  @IsNumber()
  @Min(0)
  readonly duracionHoras: number;

  @IsString()
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
  @IsOptional()
  readonly aprenderas?: string[];

  @IsArray()
  @IsOptional()
  readonly objetivos?: string[];

  @IsArray()
  @IsOptional()
  readonly dirigidoA?: string[];

  @ValidateNested({ each: true })
  @Type(() => EstructuraProgramariaDto)
  @IsArray()
  @IsOptional()
  readonly contenido?: EstructuraProgramariaDto[];

  @IsDateString()
  @IsOptional()
  readonly fechaLanzamiento?: Date;

  @IsArray()
  @IsOptional() // Permite cursos sin categorías asignadas.
  readonly categoriaIds?: Categoria['_id'][]; // Conservando el uso de Id
}

// Las mismas mejoras y principios de opcionalidad y validación específica se aplican a UpdateCursoDto, manteniendo la consistencia y claridad en el código.

export class UpdateCursoDto extends PartialType(CreateCursoDto) {}
