import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUsuarioInput } from './create-usuario.input';
import { ArrayUnique, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class UpdateUsuarioInput extends PartialType(
  OmitType(CreateUsuarioInput, ['password', 'email'] as const),
) {
  @Field(() => [ID], { nullable: true }) // IDs se manejan como strings en GraphQL
  @IsArray()
  @IsOptional()
  @ArrayUnique()
  cursosFavoritos?: Types.ObjectId[];
}
