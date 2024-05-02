import {
  IsNumber,
  IsString,
  IsOptional,
  IsMongoId,
  IsDate,
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

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'Fecha cuando se realiza el comentario' })
  readonly fecha?: Date;
}

export class UpdateComentariosDto extends PartialType(CreateComentariosDto) {}
