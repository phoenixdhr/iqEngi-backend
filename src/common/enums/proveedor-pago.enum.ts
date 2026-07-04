import { registerEnumType } from '@nestjs/graphql';

export enum ProveedorPago {
  DLOCAL = 'dlocal',
  MERCADOPAGO = 'mercadopago',
  BITPAY = 'bitpay',
}

registerEnumType(ProveedorPago, {
  name: 'ProveedorPago',
  description: 'Proveedores de pago disponibles',
});
