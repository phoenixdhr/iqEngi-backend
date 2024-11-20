import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateCuestionarioInput } from './create-cuestionario.input';

@InputType()
export class UpdateCuestionarioInput extends PartialType(
  OmitType(CreateCuestionarioInput, ['cursoId'] as const),
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
