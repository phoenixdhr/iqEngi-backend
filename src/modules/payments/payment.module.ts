/* MODIFICACIONES DESDE EL 贚TIMO COMMIT:
 * - Actualizaci髇 de proveedores y servicios inyectados en el m骴ulo.
 */
/*
 * ==============================================================================
 * NOTA DE CAMBIOS RECIENTES (Refactorizaci贸n Arquitectura de Pagos)
 * ==============================================================================
 * Este archivo fue modificado para soportar la separaci贸n de responsabilidades 
 * entre 'Orden' y 'Payment'.
 * 
 * Principales cambios:
 * 1. Se independiz贸 el concepto de Orden (intenci贸n de compra) del Payment (intento de pago).
 * 2. Se implement贸 una l贸gica de expiraci贸n estricta sincronizada con las pasarelas (expiresAt).
 * 3. Se garantiz贸 la idempotencia completa en los webhooks para evitar procesamiento duplicado.
 * 4. Se migr贸 el campo 'metodoPago' a 'paymentProvider' / 'ProveedorPago'.
 * ==============================================================================
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentResolver } from './resolvers/payment.resolver';
import { PaymentExpirationCron } from './crons/payment-expiration.cron';

import { MercadoPagoStrategy } from './strategies/mercadopago.strategy';
import { DLocalStrategy } from './strategies/dlocal.strategy';
import { BitPayStrategy } from './strategies/bitpay.strategy';
import { IniciarPagoThrottleGuard } from './guards/iniciar-pago-throttle.guard';

import { OrdenModule } from '../orden/orden.module';
import { CursoCompradoModule } from '../curso-comprado/curso-comprado.module';
import { MailModule } from '../mail/mail.module';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    HttpModule,
    OrdenModule,
    CursoCompradoModule,
    MailModule,
    ExchangeRateModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentResolver,
    MercadoPagoStrategy,
    DLocalStrategy,
    BitPayStrategy,
    PaymentExpirationCron,
    IniciarPagoThrottleGuard,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}


