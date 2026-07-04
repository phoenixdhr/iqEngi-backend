/* MODIFICACIONES DESDE EL �LTIMO COMMIT:
 * - Limpieza de comentarios innecesarios.
 * - Mejoras en la validaci�n de la firma (HMAC) con timingSafeEqual para mayor seguridad.
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

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import * as crypto from 'crypto';
import configEnv from 'src/common/enviroments/configEnv';
import {
  PaymentStrategy,
  CreatePaymentParams,
  CreatePaymentResult,
  WebhookValidationResult,
} from '../interfaces/payment-strategy.interface';

/**
 * Monedas que MercadoPago acepta como `currency_id` en una preferencia.
 * Si llega cualquier otro código (p.ej. EUR), MP rechazará el preference.create
 * o cobrará en una moneda incorrecta. Se hace fallback a USD.
 */
const MP_SUPPORTED_CURRENCIES = new Set([
  'ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU', 'USD',
]);

@Injectable()
export class MercadoPagoStrategy implements PaymentStrategy {
  private readonly logger = new Logger(MercadoPagoStrategy.name);
  private readonly client: MercadoPagoConfig;
  private readonly isProduction: boolean;

  constructor(
    @Inject(configEnv.KEY)
    private readonly config: ConfigType<typeof configEnv>,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.config.payments.mercadopago.accessToken,
    });
    this.isProduction = this.config.isProduction;
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const preference = new Preference(this.client);

    // Validar currency_id contra la lista soportada por MP. Si no lo está,
    // hacemos fallback a USD para no romper la creación. El amount ya viene
    // convertido por PaymentService usando ExchangeRateService.
    const currencyId = MP_SUPPORTED_CURRENCIES.has(params.currency)
      ? params.currency
      : 'USD';

    if (currencyId !== params.currency) {
      this.logger.warn(
        `Moneda "${params.currency}" no soportada por MercadoPago. Usando USD.`,
      );
    }

    const result = await preference.create({
      body: {
        items: [
          {
            id: params.ordenId.toString(),
            title: params.description,
            quantity: 1,
            unit_price: params.amount,
            currency_id: currencyId,
          },
        ],
        payer: { email: params.customerEmail },
        back_urls: {
          success: params.successUrl,
          failure: params.cancelUrl,
          pending: params.pendingUrl,
        },
        auto_return: 'approved',
        // En external_reference enviamos NUESTRO ID DE ORDEN.
        // MP lo devolverá intacto en el webhook.
        external_reference: params.ordenId.toString(),
        // URL pública del webhook. Si no se pasa, MP usa la del dashboard
        // (frecuentemente desconfigurada en local → webhook nunca llega).
        notification_url: params.notificationUrl,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: params.expiresAt.toISOString(),
      },
      requestOptions: {
        idempotencyKey: params.idempotencyKey,
      },
    });

    // En desarrollo/sandbox usamos sandbox_init_point para que las tarjetas
    // de prueba funcionen. init_point apunta al checkout de producción donde
    // las tarjetas de prueba son rechazadas con "No pudimos procesar tu pago".
    const paymentUrl = this.isProduction
      ? result.init_point
      : result.sandbox_init_point;

    return {
      providerPaymentId: result.id,
      paymentUrl,
    };
  }

  async handleWebhook(
    body: any,
    headers: Record<string, string>,
  ): Promise<WebhookValidationResult> {
    const webhookSecret = this.config.payments.mercadopago.webhookSecret;

    // En producción exigimos webhookSecret. En dev permitimos sin firma para
    // facilitar pruebas con ngrok/localhost.tunnel, pero lo logueamos.
    if (!webhookSecret) {
      if (this.config.isProduction) {
        this.logger.error(
          'MP_WEBHOOK_SECRET no configurado en producción. Webhook rechazado.',
        );
        return { isValid: false };
      }
      this.logger.warn(
        'MP_WEBHOOK_SECRET no configurado. Webhook aceptado SIN validación de firma (solo dev).',
      );
    }

    if (webhookSecret) {
      const xSignature = headers['x-signature'] || '';
      const xRequestId = headers['x-request-id'] || '';

      const parts = xSignature.split(',');
      const tsMatch = parts.find((p) => p.trim().startsWith('ts='));
      const v1Match = parts.find((p) => p.trim().startsWith('v1='));

      if (!tsMatch || !v1Match) {
        this.logger.warn('Webhook MercadoPago sin headers x-signature válidos');
        return { isValid: false };
      }

      const ts = tsMatch.split('=')[1];
      const v1 = v1Match.split('=')[1];

      const dataId = body?.data?.id || '';
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const computedHash = crypto
        .createHmac('sha256', webhookSecret)
        .update(manifest)
        .digest('hex');

      // timingSafeEqual evita timing attacks al comparar las firmas.
      const a = Buffer.from(computedHash, 'hex');
      const b = Buffer.from(v1, 'hex');
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        this.logger.warn('Firma de webhook MercadoPago inválida');
        return { isValid: false };
      }
    }

    // Solo procesamos notificaciones de tipo payment
    if (body.type !== 'payment' || !body.data?.id) {
      return { isValid: false };
    }

    // Consultar estado real del pago en MercadoPago
    const paymentApi = new MPPayment(this.client);
    const payment = await paymentApi.get({ id: body.data.id });

    const statusMap: Record<string, WebhookValidationResult['status']> = {
      approved: 'approved',
      rejected: 'rejected',
      pending: 'pending',
      in_process: 'pending',
      cancelled: 'cancelled',
    };

    return {
      isValid: true,
      // external_reference que enviamos al crear la preferencia (= ordenId)
      originalOrdenId: payment.external_reference,
      status: statusMap[payment.status] || 'pending',
      rawData: payment as unknown as Record<string, any>,
    };
  }

  async getPaymentStatus(externalId: string): Promise<string> {
    const paymentApi = new MPPayment(this.client);
    try {
      const payment = await paymentApi.get({ id: Number(externalId) });
      return payment.status || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

