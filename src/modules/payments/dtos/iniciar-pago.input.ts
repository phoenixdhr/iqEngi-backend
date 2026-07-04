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
import { ProveedorPago } from 'src/common/enums/proveedor-pago.enum';

@InputType()
export class IniciarPagoInput {
  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  cursosIds: Types.ObjectId[];

  @Field(() => ProveedorPago)
  @IsNotEmpty()
  @IsEnum(ProveedorPago)
  paymentProvider: ProveedorPago;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;
}
