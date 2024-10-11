import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class IdInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}
