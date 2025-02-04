import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { IRespuestaPreguntaInput } from '../../interfaces/respuesta-pregunta.interface';
import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';

@InputType()
export class CreateRespuestaPreguntaInput implements IRespuestaPreguntaInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  preguntaId: Types.ObjectId;

  @Field(() => [ID], {
    nullable: true,
    description:
      'Respuestas seleccionadas a partir de las opciones de las preguntas',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  respuestaId?: Opcion[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  respuestaAbierta?: string;
}
