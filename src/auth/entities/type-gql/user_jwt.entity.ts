import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { RolEnum } from 'src/auth/enums/roles.model';
import { UserGoogle } from 'src/auth/models/perfil.google';

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

@ObjectType()
export class userAndJWT {
  @Field(() => UserRequest)
  user: UserRequest;

  @Field()
  access_token: string;
}

@ObjectType()
export class PayloadGql {
  @Field(() => [RolEnum])
  roles: RolEnum[];

  @Field(() => ID)
  sub: string;
}
