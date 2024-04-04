import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
// import type { Id } from '../../common/dtos/id';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Curso } from 'src/cursos/entities/curso.entity';

enum EstadoOrden {
  Pendiente = 'pendiente',
  Procesando = 'procesando',
  Completada = 'completada',
  Cancelada = 'cancelada',
  Reembolsada = 'reembolsada',
}

export class CreateOrdenDto {
  @IsString()
  readonly usuarioId: Usuario['_id'];

  @IsArray()
  @ArrayNotEmpty()
  readonly cursos: Curso['_id'][];

  @IsDate()
  readonly fechaCompra: Date;

  @IsNumber()
  readonly montoTotal: number;

  @IsEnum(EstadoOrden)
  readonly estado: EstadoOrden;
}

export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {}
