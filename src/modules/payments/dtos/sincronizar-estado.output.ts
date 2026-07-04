import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';

/**
 * Resultado de la sincronización pull (Payment_verificarEstadoPorOrden).
 * Contiene SOLO los campos que el frontend necesita para decidir qué pantalla
 * mostrar tras volver de la pasarela. Evita exponer paymentUrl, idempotencyKey
 * o webhookData a un cliente que solo necesita saber el estado.
 */
@ObjectType()
export class SincronizarEstadoOutput {
  @Field(() => EstadoPago)
  status: EstadoPago;

  @Field(() => ID)
  ordenId: string;

  @Field(() => ID)
  paymentId: string;
}
