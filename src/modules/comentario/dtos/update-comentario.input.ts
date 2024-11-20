import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateComentario_userInput } from './create-comentario-user.input';

@InputType()
export class UpdateComentarioInput extends PartialType(
  OmitType(CreateComentario_userInput, ['cursoId'] as const),
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
