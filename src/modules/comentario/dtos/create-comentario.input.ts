// comentario/dtos/create-comentario.input.ts

import { InputType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IComentarioInput } from '../interfaces/comentario.interface';

@InputType()
export class CreateComentarioInput implements IComentarioInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  usuarioId: Types.ObjectId;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field()
  @IsNotEmpty()
  @IsString()
  comentario: string;
}
