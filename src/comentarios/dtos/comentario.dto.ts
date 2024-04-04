import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';
import type { Id } from '../../_common/dtos/id';
import { PartialType } from '@nestjs/swagger';

export class CreateComentariosDto {
  @IsString()
  readonly _id: Id; // Asumiendo que quieres poder establecer el ID al crear un comentario

  @IsString()
  readonly cursoId: Id;

  @IsString()
  readonly usuarioId: Id;

  @IsString()
  readonly comentario: string;

  @IsNumber()
  @IsOptional()
  readonly calificacion?: number;

  @IsDate()
  readonly fecha: Date;
}

export class UpdateComentariosDto extends PartialType(CreateComentariosDto) {}
