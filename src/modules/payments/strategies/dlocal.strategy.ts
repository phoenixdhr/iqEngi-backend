import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

import configEnv from 'src/common/enviroments/configEnv';
import {
  PaymentStrategy,
  CreatePaymentParams,
  CreatePaymentResult,
  WebhookValidationResult,
} from '../interfaces/payment-strategy.interface';

@Injectable()
export class DLocalStrategy implements PaymentStrategy {
  private readonly logger = new Logger(DLocalStrategy.name);

  constructor(
    @Inject(configEnv.KEY)
    private readonly config: ConfigType<typeof configEnv>,
    private readonly httpService: HttpService,
  ) { }

  private get apiUrl(): string {
    return this.config.payments.dlocal.apiUrl;
  }

  private getHeaders(): Record<string, string> {
    const { xLogin, xTransKey, secretKey } = this.config.payments.dlocal;
    const date = new Date().toISOString();
    const authString = `${xLogin}${date}${secretKey}`;
    const authorization = crypto
      .createHmac('sha256', secretKey)
      .update(authString)
      .digest('hex');

    return {
      'X-Date': date,
      'X-Login': xLogin,
      'X-Trans-Key': xTransKey,
      Authorization: `V2-HMAC-SHA256, Signature: ${authorization}`,
      'Content-Type': 'application/json',
    };
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const body = {
      amount: params.amount,
      currency: params.currency,
      country: this.getCountryFromCurrency(params.currency),
      payment_method_flow: 'REDIRECT',
      payer: {
        email: params.customerEmail,
      },
      order_id: params.ordenId.toString(),
      description: params.description,
      notification_url: undefined, // Se configura por webhook en el controller
      callback_url: params.successUrl,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.apiUrl}/v1/payments`, body, {
        headers: this.getHeaders(),
      }),
    );

    return {
      providerPaymentId: response.data.id,
      paymentUrl: response.data.redirect_url,
    };
  }

  async handleWebhook(
    body: any,
    headers: Record<string, string>,
  ): Promise<WebhookValidationResult> {
    const signature = headers['x-dlocal-signature'] || '';
    const { secretKey } = this.config.payments.dlocal;

    if (secretKey && signature) {
      const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(JSON.stringify(body))
        .digest('hex');

      if (computedSignature !== signature) {
        this.logger.warn('Firma de webhook dLocal inválida');
        return { isValid: false };
      }
    }

    const statusMap: Record<string, WebhookValidationResult['status']> = {
      PAID: 'approved',
      REJECTED: 'rejected',
      PENDING: 'pending',
      CANCELLED: 'cancelled',
      REFUNDED: 'approved', // Manejar reembolso por separado
    };

    return {
      isValid: true,
      originalOrdenId: body.order_id,
      status: statusMap[body.status] || 'pending',
      rawData: body,
    };
  }

  async getPaymentStatus(externalId: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/v1/payments/${externalId}`, {
          headers: this.getHeaders(),
        }),
      );
      return response.data.status || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private getCountryFromCurrency(currency: string): string {
    const currencyCountryMap: Record<string, string> = {
      PEN: 'PE',
      BRL: 'BR',
      MXN: 'MX',
      CLP: 'CL',
      COP: 'CO',
      ARS: 'AR',
      UYU: 'UY',
      EUR: 'ES',
      USD: 'US',
    };
    return currencyCountryMap[currency] || 'US';
  }
}
