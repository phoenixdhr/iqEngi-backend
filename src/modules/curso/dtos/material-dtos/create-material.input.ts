import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { IMaterialInput } from '../../interfaces/material.interface';

@InputType()
export class CreateMaterialInput implements IMaterialInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  materialTitle: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;
}
