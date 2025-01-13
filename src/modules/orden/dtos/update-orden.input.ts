// // orden/dtos/update-orden.input.ts

import { EstadoOrden } from 'src/common/enums';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

// import { InputType, PartialType } from '@nestjs/graphql';
// import { CreateOrdenInput } from './create-orden.input';

// @InputType()
// export class UpdateOrdenInput extends PartialType(CreateOrdenInput) {}

@InputType()
export class UpdateOrdenInput {
  // Los campos fechaCreacion y montoTotal pueden ser gestionados automáticamente por el servicio
  @Field(() => EstadoOrden)
  @IsOptional()
  estado_orden?: EstadoOrden;
}
