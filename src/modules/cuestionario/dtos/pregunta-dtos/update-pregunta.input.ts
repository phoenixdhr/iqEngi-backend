import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePreguntaInput } from './create-pregunta.input';

@InputType()
export class UpdatePreguntaInput extends PartialType(CreatePreguntaInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
