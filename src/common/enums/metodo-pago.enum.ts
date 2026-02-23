import { registerEnumType } from '@nestjs/graphql';

export enum MetodoPago {
  DLOCAL = 'dlocal',
  MERCADOPAGO = 'mercadopago',
  BITPAY = 'bitpay',
}

registerEnumType(MetodoPago, {
  name: 'MetodoPago',
  description: 'Proveedores de pago disponibles',
});
