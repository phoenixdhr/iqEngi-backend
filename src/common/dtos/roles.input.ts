import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional } from 'class-validator';
import { RolEnum } from '../enums';

@InputType()
export class RolesInput {
  @Field(() => [RolEnum], { nullable: true })
  @IsArray()
  @IsOptional()
  roles: RolEnum[];
}
