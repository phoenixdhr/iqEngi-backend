import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import type { Id } from './id';

enum EstadoOrden {
  Pendiente = 'pendiente',
  Procesando = 'procesando',
  Completada = 'completada',
  Cancelada = 'cancelada',
  Reembolsada = 'reembolsada',
}

export class OrdenDto {
  @IsString()
  readonly usuarioId: Id;

  @IsArray()
  readonly cursos: Id[];

  @IsDate()
  readonly fechaCompra: Date;

  @IsNumber()
  readonly montoTotal: number;

  @IsEnum(EstadoOrden)
  readonly estado: EstadoOrden;
}
