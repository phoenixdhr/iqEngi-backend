import { Types } from 'mongoose';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IPayment extends IdInterface {
  _id: Types.ObjectId;
  ordenId: Types.ObjectId;
  usuarioId: Types.ObjectId;
  provider: MetodoPago;
  externalId?: string;
  status: EstadoPago;
  amount: number;
  currency: string;
  paymentUrl?: string;
  webhookData?: Record<string, any>;
  idempotencyKey?: string;
}
