import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
import { Type } from 'class-transformer';
import { CreateOpcionInput } from '../opcion-dtos/create-opcion.input';
import { Types } from 'mongoose';
import { IPreguntaInput } from '../../interfaces/pregunta.interface';

@InputType()
export class CreatePreguntaInput implements IPreguntaInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  enunciado: string;

  @Field(() => TipoPregunta)
  @IsNotEmpty()
  @IsEnum(TipoPregunta)
  tipoPregunta: TipoPregunta;

  @Field(() => [CreateOpcionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionInput)
  opciones?: CreateOpcionInput[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  moduloId?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  unidadId?: Types.ObjectId;
}
