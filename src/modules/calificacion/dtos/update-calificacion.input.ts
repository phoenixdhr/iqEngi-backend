// calificacion/dtos/update-calificacion.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCalificacion_userInput } from './create-calificacion-user.input';

@InputType()
export class UpdateCalificacionInput extends PartialType(
  CreateCalificacion_userInput,
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
