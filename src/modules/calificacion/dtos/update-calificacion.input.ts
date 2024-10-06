// calificacion/dtos/update-calificacion.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCalificacionInput } from './create-calificacion.input';

@InputType()
export class UpdateCalificacionInput extends PartialType(
  CreateCalificacionInput,
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
