// instructor/dtos/update-instructor.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateInstructorInput } from './create-instructor.input';

@InputType()
export class UpdateInstructorInput extends PartialType(CreateInstructorInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
