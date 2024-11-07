import { InputType, PartialType } from '@nestjs/graphql';
import { CreateOpcionInput } from './create-opcion.input';

@InputType()
export class UpdateOpcionInput extends PartialType(CreateOpcionInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
