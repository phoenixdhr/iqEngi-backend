import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContactoResponseDto {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  error?: string;
}
