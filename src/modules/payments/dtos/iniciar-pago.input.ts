import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsArray,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { Types } from 'mongoose';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';

@InputType()
export class IniciarPagoInput {
  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  cursosIds: Types.ObjectId[];

  @Field(() => MetodoPago)
  @IsNotEmpty()
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;
}
