// src/users/dto/verify-email.input.ts

import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  token: string; // Token enviado por email
}
