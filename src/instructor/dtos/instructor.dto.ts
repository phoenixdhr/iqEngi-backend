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
  readonly firstName: string;

  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly profesion?: string;

  @IsArray()
  @IsString({ each: true })
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

// #region Filter Paginacion
export class FilterInstructorDto {
  @IsOptional()
  @IsPositive() // Solo números positivos desde el 1
  limit: number;

  @IsOptional()
  @Min(0) // Solo números positivos desde el 0
  offset: number;
}
