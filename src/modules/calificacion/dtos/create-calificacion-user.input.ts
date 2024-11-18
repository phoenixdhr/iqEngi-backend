import { InputType, OmitType } from '@nestjs/graphql';
import { CreateCalificacionInput } from './create-calificacion.input';

@InputType()
export class CreateCalificacionUserInput extends OmitType(
  CreateCalificacionInput,
  ['usuarioId'] as const,
) {
  // Esta clase extiende de CreateCalificacionInput excluyendo el campo usuarioId usando OmitType.
}
