// respuesta-cuestionario/dtos/create-respuesta-pregunta.input.ts

import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';
import { IRespuestaPreguntaInput } from '../../interfaces/respuesta-pregunta.interface';

@InputType()
export class CreateRespuestaPreguntaInput implements IRespuestaPreguntaInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  preguntaId: Types.ObjectId;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  opcionIds?: Types.ObjectId[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  respuestaAbierta?: string;
}
