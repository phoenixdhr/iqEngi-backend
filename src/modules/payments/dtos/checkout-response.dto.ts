import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CheckoutResponse {
  @Field(() => ID)
  ordenId: string;

  @Field({ nullable: true })
  paymentUrl?: string;
}
