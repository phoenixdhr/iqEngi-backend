import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsMongoId,
} from 'class-validator';

import { ICuestionarioInput } from '../../interfaces/cuestionario.interface';
import { Types } from 'mongoose';

@InputType()
export class CreateCuestionarioInput implements ICuestionarioInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cuestionarioTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  // @Field(() => [CreatePreguntaInput], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreatePreguntaInput)
  // preguntas?: CreatePreguntaInput[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  numeroPreguntasPresentar?: number;
}
