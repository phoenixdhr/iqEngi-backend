import { InputType, Field, ID, OmitType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsArray,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';
import { IRespuestaPreguntaInput } from '../../interfaces/respuesta-pregunta.interface';
// import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';
import { TipoPregunta } from 'src/common/enums';
import { RespuestaDataInput } from './create-respuestaData.dto';
import { Type } from 'class-transformer';

@InputType()
export class CreateRespuestaPreguntaInput implements IRespuestaPreguntaInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  preguntaId: Types.ObjectId;

  @Field(() => [RespuestaDataInput], {
    // 🔹 Usar InputType en vez de ObjectType
    nullable: true,
    description:
      'Respuestas seleccionadas a partir de las opciones de las preguntas',
  })
  @IsOptional()
  @IsArray()
  @Type(() => RespuestaDataInput) // 🔹 @Type no recibe arrays, solo la clase base
  respuestaId?: RespuestaDataInput[];

  @Field(() => TipoPregunta, { nullable: true })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(TipoPregunta)
  tipoPregunta?: TipoPregunta;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  respuestaAbierta?: string;

  @Field()
  @IsBoolean()
  @IsOptional()
  esCorrecto?: boolean;
}

@InputType()
export class CreateRespuestaPregunta_ResolverInput extends OmitType(
  CreateRespuestaPreguntaInput,
  ['tipoPregunta', 'esCorrecto'],
) {}
