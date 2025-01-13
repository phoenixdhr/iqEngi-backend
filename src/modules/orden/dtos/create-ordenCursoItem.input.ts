import { InputType, Field, ID, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ICursosItemOrden } from '../interfaces/orden.interface';
import { Types } from 'mongoose';

@InputType()
export class CreateOrdenCursoItemDto implements ICursosItemOrden {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  courseTitle: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  descuento?: number;
}
