import { IsDate, IsNumber, IsString } from 'class-validator';
import type { Id } from './id';

export class TestimonioDto {
  @IsString()
  readonly cursoId: Id;

  @IsString()
  readonly usuarioId: Id;

  @IsString()
  readonly comentario: string;

  @IsNumber()
  readonly calificacion: number;

  @IsDate()
  readonly fecha: Date;
}
