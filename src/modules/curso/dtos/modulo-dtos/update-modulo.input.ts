// curso/dtos/modulo-dtos/update-modulo.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateModuloInput } from './create-modulo.input';

@InputType()
export class UpdateModuloInput extends PartialType(CreateModuloInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
