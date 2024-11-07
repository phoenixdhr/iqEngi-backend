import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUnidadInput } from './create-unidad.input';

@InputType()
export class UpdateUnidadInput extends PartialType(CreateUnidadInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
