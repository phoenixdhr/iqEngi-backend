import { InputType, Field, ID, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsBoolean,
  IsNumber,
  Max,
} from 'class-validator';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';

import { Types } from 'mongoose';
import { IPreguntaInput } from '../../interfaces/pregunta.interface';

@InputType()
export class CreatePreguntaInput implements IPreguntaInput {
  @Field(() => String)
  @IsNotEmpty()
  enunciado: string;

  @Field(() => TipoPregunta)
  @IsNotEmpty()
  @IsEnum(TipoPregunta)
  tipoPregunta: TipoPregunta;

  // @Field(() => [CreateOpcionInput], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateOpcionInput)
  // opciones?: CreateOpcionInput[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  moduloId?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  unidadId?: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  respuestaOrdenamiento?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  published: boolean = false;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Max(5)
  puntos: number = 1;
}
