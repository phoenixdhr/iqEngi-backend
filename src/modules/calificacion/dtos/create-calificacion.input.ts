// calificacion/dtos/create-calificacion.input.ts

import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';
import { ICalificacionInput } from '../interfaces/calificacion.interface';
import { Types } from 'mongoose';

@InputType()
export class CreateCalificacionInput implements ICalificacionInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  usuarioId: Types.ObjectId;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  valor: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comentario?: string;
}
