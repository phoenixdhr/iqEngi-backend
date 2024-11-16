import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export default class SearchFieldArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  field?: string;
}
