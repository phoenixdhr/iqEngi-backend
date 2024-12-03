import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsUrl,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMaterialInput } from '../material-dtos/create-material.input';
import { IUnidadInput } from '../../interfaces/unidad.interface';
import { Types } from 'mongoose';

@InputType()
export class CreateUnidadInput implements IUnidadInput {
  @Field(() => ID)
  @IsNotEmpty()
  moduloId: Types.ObjectId;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numeroUnidad: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  unidadTitle: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  urlVideo?: string;

  @Field(() => [CreateMaterialInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialInput)
  materiales?: CreateMaterialInput[];
}
