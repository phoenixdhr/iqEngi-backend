// respuesta-cuestionario/dtos/update-respuesta-cuestionario.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRespuestaCuestionarioInput } from './create-respuesta-cuestionario.dto';

@InputType()
export class UpdateRespuestaCuestionarioInput extends PartialType(
  CreateRespuestaCuestionarioInput,
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
