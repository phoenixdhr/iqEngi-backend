import {
  // IsDate,
  IsNumber,
  IsString,
  IsOptional,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateComentariosDto {
  @IsMongoId()
  @ApiProperty({ description: 'ID del curso asociado al comentario' })
  readonly cursoId: string;

  @IsMongoId()
  @ApiProperty({ description: 'ID del usuario que realiza el comentario' })
  readonly usuarioId: string;

  @IsString()
  @ApiProperty({ description: 'Contenido del comentario' })
  readonly comentario: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Calificación numérica del comentario' })
  readonly calificacion?: number;

  @IsDateString()
  @ApiProperty({ description: 'Fecha cuando se realiza el comentario' })
  readonly fecha: string; // Usamos string para la fecha para facilitar la validación
}

export class UpdateComentariosDto extends PartialType(CreateComentariosDto) {}
