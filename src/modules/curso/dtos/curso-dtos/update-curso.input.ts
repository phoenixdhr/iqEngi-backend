import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCursoInput } from './create-curso.input';

@InputType()
export class UpdateCursoInput extends PartialType(CreateCursoInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;
}
