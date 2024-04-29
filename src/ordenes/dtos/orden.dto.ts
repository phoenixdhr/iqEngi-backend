// import {
//   IsArray,
//   IsDate,
//   IsEnum,
//   IsNumber,
//   IsString,
//   ArrayNotEmpty,
// } from 'class-validator';
// import { PartialType } from '@nestjs/swagger';
// // import type { Id } from '../../common/dtos/id';
// import { Usuario } from 'src/usuarios/entities/usuario.entity';
// import { Curso } from 'src/cursos/entities/curso.entity';

// enum EstadoOrden {
//   Pendiente = 'pendiente',
//   Procesando = 'procesando',
//   Completada = 'completada',
//   Cancelada = 'cancelada',
//   Reembolsada = 'reembolsada',
// }

// export class CreateOrdenDto {
//   @IsString()
//   readonly usuarioId: Usuario['_id'];

//   @IsArray()
//   @ArrayNotEmpty()
//   readonly cursos: Curso['_id'][];

//   @IsDate()
//   readonly fechaCompra: Date;

//   @IsNumber()
//   readonly montoTotal: number;

//   @IsEnum(EstadoOrden)
//   readonly estado: EstadoOrden;
// }

// export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {}

import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { EstadoOrden } from '../entities/orden.entity';
import { Types } from 'mongoose';

// Tipo string para IDs: Cambié el tipo de usuarioId y cursos a string,
// que es más adecuado para la validación de DTOs en un entorno de API,
// asegurando que los IDs sean validados como ObjectId de MongoDB utilizando el decorador @IsMongoId().

export class CreateOrdenDto {
  @IsString()
  @IsMongoId()
  readonly usuarioId: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  readonly cursos: Types.Array<Types.ObjectId>;

  @IsDate()
  readonly fechaCompra: Date;

  @IsNumber()
  readonly montoTotal: number;

  @IsEnum(EstadoOrden)
  readonly estado: EstadoOrden;
}

export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {}
