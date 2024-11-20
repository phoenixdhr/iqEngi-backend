import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ObjectType() // Cambia esto de InputType a ObjectType
export class DeletedCountOutput {
  @Field()
  @IsNumber()
  readonly deletedCount: number;
}
