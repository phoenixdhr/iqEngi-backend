import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsString()
  readonly oldPassword: string;

  @Field()
  @IsString()
  readonly newPassword: string;
}
