import { IsString, IsOptional } from 'class-validator';

export class CategoriaDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  @IsOptional()
  readonly descripcion?: string;
}
