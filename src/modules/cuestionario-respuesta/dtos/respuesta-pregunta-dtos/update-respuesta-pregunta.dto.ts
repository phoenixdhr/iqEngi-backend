import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRespuestaPreguntaInput } from './create-respuesta-pregunta.dto';

@InputType()
export class UpdateRespuestaPreguntaInput extends PartialType(
  CreateRespuestaPreguntaInput,
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // preguntaId: string;
}
