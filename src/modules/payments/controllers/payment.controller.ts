import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  Query,
  HttpCode,
  Inject,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigType } from '@nestjs/config';

import configEnv from 'src/common/enviroments/configEnv';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    @Inject(configEnv.KEY)
    private readonly config: ConfigType<typeof configEnv>,
  ) {}

  // #region Webhooks

  @Post('webhook/mercadopago')
  @HttpCode(200)
  async webhookMercadoPago(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.paymentService.procesarWebhook(
        MetodoPago.MERCADOPAGO,
        req.body,
        req.headers as Record<string, string>,
      );
    } catch (error) {
      this.logger.error(`Error procesando webhook MercadoPago: ${error.message}`);
    }
    // Siempre responder 200 para evitar reintentos
    res.status(200).send('OK');
  }

  @Post('webhook/dlocal')
  @HttpCode(200)
  async webhookDLocal(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.paymentService.procesarWebhook(
        MetodoPago.DLOCAL,
        req.body,
        req.headers as Record<string, string>,
      );
    } catch (error) {
      this.logger.error(`Error procesando webhook dLocal: ${error.message}`);
    }
    res.status(200).send('OK');
  }

  @Post('webhook/bitpay')
  @HttpCode(200)
  async webhookBitPay(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.paymentService.procesarWebhook(
        MetodoPago.BITPAY,
        req.body,
        req.headers as Record<string, string>,
      );
    } catch (error) {
      this.logger.error(`Error procesando webhook BitPay: ${error.message}`);
    }
    res.status(200).send('OK');
  }

  // #endregion

  // #region Return URLs (redirigen al frontend)

  @Get('return/success')
  returnSuccess(
    @Query('orden_id') ordenId: string,
    @Res() res: Response,
  ): void {
    const frontendUrl = this.config.dominioFrontend;
    res.redirect(`${frontendUrl}/checkout/confirmacion?orden_id=${ordenId}`);
  }

  @Get('return/cancel')
  returnCancel(
    @Query('orden_id') ordenId: string,
    @Res() res: Response,
  ): void {
    const frontendUrl = this.config.dominioFrontend;
    res.redirect(`${frontendUrl}/checkout/cancelacion?orden_id=${ordenId}`);
  }

  @Get('return/pending')
  returnPending(
    @Query('orden_id') ordenId: string,
    @Res() res: Response,
  ): void {
    const frontendUrl = this.config.dominioFrontend;
    res.redirect(`${frontendUrl}/checkout/pendiente?orden_id=${ordenId}`);
  }

  // #endregion
}
