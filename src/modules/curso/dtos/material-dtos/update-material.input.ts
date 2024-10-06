// curso/dtos/material-dtos/update-material.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMaterialInput } from './create-material.input';

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
