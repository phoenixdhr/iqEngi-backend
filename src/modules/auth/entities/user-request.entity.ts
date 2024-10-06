import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { RolEnum } from 'src/common/enums';
import { UserGoogle } from '../interfaces/google-user.interface';

@ObjectType()
export class UserRequest implements UserGoogle {
  @Field(() => ID)
  _id: string;

  @Field(() => [RolEnum])
  roles: RolEnum[];

  @Field(() => Int, { nullable: true })
  iat: number;

  @Field(() => Int, { nullable: true })
  exp: number;

  @Field()
  email: string;

  @Field()
  email_verified: boolean;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => String, { nullable: true })
  picture?: string;
}
