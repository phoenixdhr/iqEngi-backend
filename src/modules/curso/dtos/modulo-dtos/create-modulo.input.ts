import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { IModuloInput } from '../../interfaces/modulo.interface';

@InputType()
export class CreateModuloInput implements IModuloInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  cursoIdString: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numeroModulo: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  moduloTitle: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  // @Field(() => [ID], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @IsMongoId({ each: true })
  // @ArrayUnique()
  // unidades?: Unidad[];
}
