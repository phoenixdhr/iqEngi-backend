import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

export class CreateProgresoCursoDto {
  @IsMongoId()
  @IsNotEmpty()
  cursoId: Types.ObjectId; // Usando IsMongoId para asegurar que el ID es un ObjectId válido

  @IsMongoId()
  @IsNotEmpty()
  usuarioId: Types.ObjectId; // Usando IsMongoId para asegurar que el ID es un ObjectId válido

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  evaluacionUsuario?: Types.ObjectId[]; // Utilizando String dentro de Type para la compatibilidad con Types.ObjectId

  @IsNumber()
  @IsNotEmpty()
  progresoTotal: number; // Se valida que sea un número y que no esté vacío
}

export class UpdateProgresoCursoDto extends PartialType(
  CreateProgresoCursoDto,
) {}
