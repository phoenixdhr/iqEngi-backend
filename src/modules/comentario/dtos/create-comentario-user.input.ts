import { InputType, OmitType } from '@nestjs/graphql';
import { CreateComentarioInput } from './create-comentario.input';

@InputType()
export class CreateComentario_userInput extends OmitType(
  CreateComentarioInput,
  ['usuarioId'] as const,
) {
  // Esta clase extiende de CreateComentarioInput excluyendo el campo usuarioId usando OmitType.
}
