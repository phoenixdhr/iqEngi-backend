// src/modules/usuario/dtos/usuarios-dtos/request-password-reset.input.ts

import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail()
  email: string;
}
