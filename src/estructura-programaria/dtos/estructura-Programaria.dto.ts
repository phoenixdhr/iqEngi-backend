import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsMongoId, // Importación añadida
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// #region UnidadEducativaDto
export class CreateUnidadEducativaAllDto {
  @IsNumber()
  readonly unidad: number;

  @IsString()
  readonly title: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional() // Temas puede ser opcional.
  readonly temas?: string[];

  @IsMongoId()
  @IsOptional() // idCuestionario puede ser opcional.
  readonly idCuestionario?: string;

  @IsMongoId()
  readonly idEstructuraProgramaria: string;
}

export class CreateUnidadEducativaDto extends PartialType(
  OmitType(CreateUnidadEducativaAllDto, ['idEstructuraProgramaria']),
) {}

export class UpdateUnidadEducativaDto extends PartialType(
  CreateUnidadEducativaDto,
) {}

// #region EstructuraProgramariaDto
export class CreateEstructuraAllProgramariaDto {
  @IsMongoId()
  readonly cursoId: string;

  @IsNumber()
  readonly modulo: number;

  @IsString()
  readonly titleModulo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUnidadEducativaDto)
  @IsOptional() // Ahora es opcional para reflejar la posibilidad de que no estén definidas al principio.
  readonly unidades?: CreateUnidadEducativaDto[];
}

export class CreateEstructuraProgramariaDto extends PartialType(
  OmitType(CreateEstructuraAllProgramariaDto, ['cursoId']),
) {}

export class UpdateEstructuraProgramariaDto extends PartialType(
  CreateEstructuraProgramariaDto,
) {}
