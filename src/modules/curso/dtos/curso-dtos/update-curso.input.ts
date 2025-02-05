import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCursoInput } from './create-curso.input';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class UpdateCursoInput extends PartialType(CreateCursoInput) {
  // @Field(() => ID)
  // @IsNotEmpty()
  // _id: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  modulosIds?: Types.ObjectId[];
}
