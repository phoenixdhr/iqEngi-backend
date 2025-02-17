import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ICategoriaInput } from '../interfaces/categoria.interface';

@InputType()
export class CreateCategoriaInput implements ICategoriaInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombreCategoria: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
