import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  IsMongoId,
  ArrayUnique,
} from 'class-validator';
import { IModuloInput } from '../../interfaces/modulo.interface';
import { Types } from 'mongoose';

@InputType()
export class CreateModuloInput implements IModuloInput {
  @Field(() => ID)
  @IsNotEmpty()
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numeroModulo: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayUnique()
  unidades?: Types.ObjectId[];
}
