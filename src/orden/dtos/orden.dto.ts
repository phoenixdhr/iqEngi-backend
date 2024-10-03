import {
  IsArray,
  IsDate,
  IsEnum,
  // IsNumber,
  ArrayNotEmpty,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { EstadoOrden } from '../entities/orden.entity';

export class CreateOrdenDto {
  @IsMongoId()
  readonly usuarioId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  readonly cursos: string[];

  @IsDate()
  @IsOptional()
  readonly fechaCompra?: Date;

  // @IsNumber()
  // readonly montoTotal: number;

  @IsEnum(EstadoOrden)
  readonly estado?: EstadoOrden;
}

export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {}

//////////////////////////////////////////////
export class ArrayCursosId {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  readonly cursos: string[];
}
