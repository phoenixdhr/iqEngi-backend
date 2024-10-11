import { Field, ObjectType } from '@nestjs/graphql';
import { UserRequest } from './user-request.entity';
import { JwtResponse } from '../interfaces/jwt-response-token.interface';

@ObjectType()
export class UserJwtOutput implements JwtResponse {
  @Field(() => UserRequest)
  user: UserRequest;

  @Field()
  accessToken: string;
}
