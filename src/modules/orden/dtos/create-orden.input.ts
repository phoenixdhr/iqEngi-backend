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
import { IOrdenInput } from '../interfaces/orden.interface';
import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { CreateOrdenCursoItemDto } from './create-ordenCursoItem.input';

@InputType()
export class CreateOrdenDto implements IOrdenInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  usuarioId?: Types.ObjectId;

  @Field(() => [CreateOrdenCursoItemDto])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrdenCursoItemDto)
  listaCursos: CreateOrdenCursoItemDto[];

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

@InputType()
export class CreateOrden_ListCursosInput {
  @Field(() => [ID], { description: 'Lista de IDs de cursos a comprar' })
  cursosIds: Types.ObjectId[];
}
