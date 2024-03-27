import { IsString, IsNumber, IsArray } from 'class-validator';

export class InstructorDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  readonly apellidos: string;

  @IsString()
  readonly profesion: string;

  @IsArray()
  readonly especializacion: string[];

  @IsNumber()
  readonly calificacionPromedio: number;

  @IsString()
  readonly pais: string;
}
