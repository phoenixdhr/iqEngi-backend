import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentResolver } from './resolvers/payment.resolver';

import { MercadoPagoStrategy } from './strategies/mercadopago.strategy';
import { DLocalStrategy } from './strategies/dlocal.strategy';
import { BitPayStrategy } from './strategies/bitpay.strategy';

import { OrdenModule } from '../orden/orden.module';
import { CursoCompradoModule } from '../curso-comprado/curso-comprado.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    HttpModule,
    OrdenModule,
    CursoCompradoModule,
    MailModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentResolver,
    MercadoPagoStrategy,
    DLocalStrategy,
    BitPayStrategy,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
