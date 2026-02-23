import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import configEnv from 'src/common/enviroments/configEnv';
import {
  PaymentStrategy,
  CreatePaymentParams,
  CreatePaymentResult,
  WebhookValidationResult,
} from '../interfaces/payment-strategy.interface';

@Injectable()
export class BitPayStrategy implements PaymentStrategy {
  private readonly logger = new Logger(BitPayStrategy.name);

  constructor(
    @Inject(configEnv.KEY)
    private readonly config: ConfigType<typeof configEnv>,
    private readonly httpService: HttpService,
  ) { }

  private get apiUrl(): string {
    return this.config.payments.bitpay.environment === 'prod'
      ? 'https://bitpay.com'
      : 'https://test.bitpay.com';
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const body = {
      price: params.amount,
      currency: params.currency,
      orderId: params.ordenId.toString(),
      itemDesc: params.description,
      buyer: { email: params.customerEmail },
      redirectURL: params.successUrl,
      closeURL: params.cancelUrl,
      notificationURL: undefined, // Se configura en el controller
      token: this.config.payments.bitpay.token,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.apiUrl}/invoices`, body, {
        headers: {
          'Content-Type': 'application/json',
          'x-accept-version': '2.0.0',
        },
      }),
    );

    const invoice = response.data.data;

    return {
      providerPaymentId: invoice.id,
      paymentUrl: invoice.url,
    };
  }

  async handleWebhook(
    body: any,
    headers: Record<string, string>,
  ): Promise<WebhookValidationResult> {
    // BitPay envía el evento en body.event y los datos en body.data
    const event = body.event;
    const data = body.data;

    if (!event || !data) {
      return { isValid: false };
    }

    // Verificar el token de webhook
    const token = this.config.payments.bitpay.token;
    if (token && body.token && body.token !== token) {
      this.logger.warn('Token de webhook BitPay inválido');
      return { isValid: false };
    }

    const statusMap: Record<string, WebhookValidationResult['status']> = {
      confirmed: 'approved',
      complete: 'approved',
      paid: 'pending', // Pagado pero no confirmado aún
      invalid: 'rejected',
      expired: 'cancelled',
      declined: 'rejected',
    };

    return {
      isValid: true,
      originalOrdenId: data.orderId,
      status: statusMap[data.status] || 'pending',
      rawData: body,
    };
  }

  async getPaymentStatus(externalId: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/invoices/${externalId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-accept-version': '2.0.0',
          },
          params: { token: this.config.payments.bitpay.token },
        }),
      );
      return response.data?.data?.status || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}
