import { InputType, Field, ID, Float, OmitType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICursosOrden, IOrdenInput } from '../interfaces/orden.interface';
import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';

@InputType()
class CursoItemInput implements ICursosOrden {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  precio: number;
}

@InputType()
export class CreateOrdenDto implements IOrdenInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  usuarioId: Types.ObjectId;

  @Field(() => [CursoItemInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CursoItemInput)
  cursos: CursoItemInput[];

  // Los campos fechaCreacion y montoTotal pueden ser gestionados automáticamente por el servicio
  @Field(() => EstadoOrden, { nullable: true })
  @IsOptional()
  estado_orden?: EstadoOrden;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  montoTotal?: number;

  @Field({ nullable: true })
  @IsOptional()
  fechaActualizacion?: Date;
}

@InputType()
export class CreateOrdenInput extends OmitType(CreateOrdenDto, [
  'estado_orden',
  'montoTotal',
  'fechaActualizacion',
]) {}
