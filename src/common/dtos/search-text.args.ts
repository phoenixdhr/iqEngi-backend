import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchTextArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search: string;
}
