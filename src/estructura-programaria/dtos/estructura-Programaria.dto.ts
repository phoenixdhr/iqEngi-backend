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
  @IsOptional() // Temas puede ser opcional.
  readonly temas?: string[];

  @IsMongoId()
  @IsOptional() // idCuestionario puede ser opcional.
  readonly idCuestionario?: string;
}

class CreateEstructuraProgramariaDto {
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

export class UpdateEstructuraProgramariaDto extends PartialType(
  CreateEstructuraProgramariaDto,
) {}
