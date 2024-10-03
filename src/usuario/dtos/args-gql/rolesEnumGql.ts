import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional } from 'class-validator';
import { RolEnum } from 'src/auth/enums/roles.model';

@InputType()
export class RolesEnumGql {
  @Field(() => [RolEnum], { nullable: true })
  @IsArray()
  @IsOptional()
  roles: RolEnum[];
}
