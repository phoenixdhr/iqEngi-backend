import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateProgresoCursoDto {
  @IsMongoId()
  @IsNotEmpty()
  cursoId: string; // Usando IsMongoId para asegurar que el ID es un ObjectId válido

  @IsMongoId()
  @IsNotEmpty()
  usuarioId: string; // Usando IsMongoId para asegurar que el ID es un ObjectId válido

  @IsArray()
  @IsMongoId({ each: true }) // Usando IsMongoId para asegurar que los IDs son ObjectIds válidos
  @IsOptional()
  evaluacionUsuario?: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  progresoTotal?: number; // Se valida que sea un número y que no esté vacío
}

export class UpdateProgresoCursoDto extends PartialType(
  CreateProgresoCursoDto,
) {}
