// cuestionario/dtos/cuestionario-dtos/update-cuestionario.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCuestionarioInput } from './create-cuestionario.input';

@InputType()
export class UpdateCuestionarioInput extends PartialType(
  CreateCuestionarioInput,
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
