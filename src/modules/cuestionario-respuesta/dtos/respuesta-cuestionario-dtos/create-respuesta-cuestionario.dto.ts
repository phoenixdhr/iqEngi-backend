import { InputType, Field, ID, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCuestionario } from 'src/common/enums/estado-cuestionario.enum';
import { CreateRespuestaPreguntaInput } from '../respuesta-pregunta-dtos/create-respuesta-pregunta.dto';
import { Types } from 'mongoose';
import { IRespuestaCuestionarioInput } from '../../interfaces/respuesta-cuestionario.interface';

@InputType()
export class CreateRespuestaCuestionarioInput
  implements IRespuestaCuestionarioInput
{
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  usuarioId: Types.ObjectId;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cuestionarioId: Types.ObjectId;

  @Field(() => [CreateRespuestaPreguntaInput])
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRespuestaPreguntaInput)
  respuestas: CreateRespuestaPreguntaInput[];

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  nota?: number;

  @Field(() => EstadoCuestionario)
  @IsEnum(EstadoCuestionario)
  @IsOptional()
  estado?: EstadoCuestionario = EstadoCuestionario.En_progreso;
}
