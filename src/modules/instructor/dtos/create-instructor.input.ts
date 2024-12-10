import { InputType, Field, OmitType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { IInstructorInput } from '../interfaces/instructor.interface';

@InputType()
export class CreateInstructorDto implements IInstructorInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profesion?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  especializacion?: string[];

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  calificacionPromedio?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pais?: string;
}

@InputType()
export class CreateInstructorInput extends OmitType(CreateInstructorDto, [
  'calificacionPromedio',
]) {}
