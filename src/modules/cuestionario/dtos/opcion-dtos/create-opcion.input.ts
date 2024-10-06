// cuestionario/dtos/opcion-dtos/create-opcion.input.ts

import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { IOpcionInput } from '../../interfaces/opcion.interface';

@InputType()
export class CreateOpcionInput implements IOpcionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  textOpcion: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  esCorrecta: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number;
}
