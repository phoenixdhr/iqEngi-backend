// calificacion/dtos/update-calificacion.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCursoComprado_userInput } from './create-curso-comprado-user.input';

@InputType()
export class UpdateCursoCompradoInput extends PartialType(
  CreateCursoComprado_userInput,
) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
