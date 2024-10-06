// categoria/dtos/update-categoria.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoriaInput } from './create-categoria.input';

@InputType()
export class UpdateCategoriaInput extends PartialType(CreateCategoriaInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
