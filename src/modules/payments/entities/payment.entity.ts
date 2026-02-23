import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';
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

  @Field(() => MetodoPago)
  @Prop({ enum: MetodoPago, required: true })
  provider: MetodoPago;

  @Field({ nullable: true })
  @Prop()
  externalId?: string;

  @Field(() => EstadoPago)
  @Prop({ enum: EstadoPago, default: EstadoPago.Pendiente })
  status: EstadoPago;

  @Field(() => Float)
  @Prop({ required: true })
  amount: number;

  @Field()
  @Prop({ default: 'USD' })
  currency: string;

  @Field({ nullable: true })
  @Prop()
  paymentUrl?: string;

  @Prop({ type: Object })
  webhookData?: Record<string, any>;

  @Field({ nullable: true })
  @Prop({ index: true })
  idempotencyKey?: string;

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
  { unique: true, sparse: true },
);
