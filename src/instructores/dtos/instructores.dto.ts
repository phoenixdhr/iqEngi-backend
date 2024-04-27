import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateInstructorDto {
  @IsString()
  @ApiProperty()
  readonly nombre: string;

  @IsString()
  @ApiProperty()
  readonly apellidos: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly profesion?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly especializacion?: string[];

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly calificacionPromedio?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly pais?: string;
}

export class UpdateInstructorDto extends PartialType(CreateInstructorDto) {}

export class FilterInstructorDto {
  @IsOptional()
  @IsPositive() // Solo números positivos desde el 1
  limit: number;

  @IsOptional()
  @Min(0) // Solo números positivos desde el 0
  offset: number;
}
