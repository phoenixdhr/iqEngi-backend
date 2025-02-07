import {
  Field,
  Float,
  InputType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { CreateCuestionarioInput } from './create-cuestionario.input';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateCuestionarioInput extends PartialType(
  OmitType(CreateCuestionarioInput, ['cursoId'] as const),
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  notaMaxima?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  notaMinimaAprobar?: number;
}
