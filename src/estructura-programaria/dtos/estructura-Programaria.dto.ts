import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsMongoId, // Importación añadida
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UnidadEducativaDto {
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

export class CreateEstructuraProgramariaDto {
  @IsNumber()
  readonly modulo: number;

  @IsString()
  readonly titleModulo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnidadEducativaDto)
  @IsOptional() // Ahora es opcional para reflejar la posibilidad de que no estén definidas al principio.
  readonly unidades?: UnidadEducativaDto[];
}

export class UpdateEstructuraProgramariaDto extends PartialType(
  CreateEstructuraProgramariaDto,
) {}
