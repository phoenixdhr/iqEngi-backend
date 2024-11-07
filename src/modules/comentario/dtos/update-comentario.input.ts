import { InputType, PartialType } from '@nestjs/graphql';
import { CreateComentarioInput } from './create-comentario.input';

@InputType()
export class UpdateComentarioInput extends PartialType(CreateComentarioInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
