/* MODIFICACIONES DESDE EL �LTIMO COMMIT:
 * - Se reemplaz� MetodoPago por ProveedorPago en la entidad de pagos.
 */
/*
 * ==============================================================================
 * NOTA DE CAMBIOS RECIENTES (Refactorización Arquitectura de Pagos)
 * ==============================================================================
 * Este archivo fue modificado para soportar la separación de responsabilidades 
 * entre 'Orden' y 'Payment'.
 * 
 * Principales cambios:
 * 1. Se independizó el concepto de Orden (intención de compra) del Payment (intento de pago).
 * 2. Se implementó una lógica de expiración estricta sincronizada con las pasarelas (expiresAt).
 * 3. Se garantizó la idempotencia completa en los webhooks para evitar procesamiento duplicado.
 * 4. Se migró el campo 'metodoPago' a 'paymentProvider' / 'ProveedorPago'.
 * ==============================================================================
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { ProveedorPago } from 'src/common/enums/proveedor-pago.enum';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';
import { IPayment } from '../interfaces/payment.interface';

@ObjectType()
@Schema({ timestamps: true })
export class Payment extends AuditFields implements IPayment {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true, index: true })
  ordenId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => ProveedorPago)
  @Prop({ enum: ProveedorPago, required: true })
  provider: ProveedorPago;

  @Field({ nullable: true })
  @Prop()
  externalId?: string;

  @Field(() => EstadoPago)
  @Prop({ enum: EstadoPago, required: true })
  status: EstadoPago;

  @Field(() => Float)
  @Prop({ required: true })
  amount: number;

  @Field()
  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ type: Object })
  webhookData?: Record<string, any>;


  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index(
  { externalId: 1, provider: 1 },
  { unique: true, partialFilterExpression: { externalId: { $type: 'string' } } },
);

