import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInstructorDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  readonly apellidos: string;

  @IsString()
  @IsOptional()
  readonly profesion?: string;

  @IsArray()
  @IsOptional()
  readonly especializacion?: string[];

  @IsNumber()
  @IsOptional()
  readonly calificacionPromedio?: number;

  @IsString()
  @IsOptional()
  readonly pais?: string;
}

export class UpdateInstructorDto extends PartialType(CreateInstructorDto) {}
