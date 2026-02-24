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

@Injectable()
export class MercadoPagoStrategy implements PaymentStrategy {
  private readonly logger = new Logger(MercadoPagoStrategy.name);
  private readonly client: MercadoPagoConfig;

  constructor(
    @Inject(configEnv.KEY)
    private readonly config: ConfigType<typeof configEnv>,
  ) {
    // MercadoPagoConfig sirve para configurar la conexión con la API de Mercado Pago.
    this.client = new MercadoPagoConfig({
      accessToken: this.config.payments.mercadopago.accessToken,
    });
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    // Preference sirve para crear preferencias de pago.
    // Las preferencias de pago representan la configuración de una transacción en el checkout de Mercado Pago, 
    // incluyendo los artículos, el pagador y las URLs de redirección tras el pago.
    const preference = new Preference(this.client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: params.ordenId.toString(),
            title: params.description,
            quantity: 1,
            unit_price: params.amount,
            currency_id: params.currency,
          },
        ],
        payer: { email: params.customerEmail },
        // back_urls sirve para configurar las URLs de redirección tras el pago.
        // success: URL a la que se redirige al usuario si el pago es exitoso.
        // failure: URL a la que se redirige al usuario si el pago falla.
        // pending: URL a la que se redirige al usuario si el pago está pendiente.
        back_urls: {
          success: params.successUrl,
          failure: params.cancelUrl,
          pending: params.pendingUrl,
        },
        // auto_return: 'approved', // Removido temporalmente para evitar el error 'invalid_auto_return' si las URLs no convencen al validador de MP
        // IMPORTANTE: En external_reference enviamos NUESTRO ID DE ORDEN.
        // Mercado Pago lo almacenará y nos lo devolverá intacto en el webhook para que identifiquemos esta orden.
        external_reference: params.ordenId.toString(),
        notification_url: undefined, // Se configura en el dashboard de MP
      },
      // requestOptions sirve para configurar opciones adicionales de la solicitud.
      // idempotencyKey sirve para evitar duplicados en las solicitudes.
      requestOptions: {
        idempotencyKey: params.idempotencyKey,
      },
    });

    return {
      // ESTE ES EL ID ÚNICO GENERADO POR MERCADO PAGO (ej. 1312312312), NO ES NUESTRO ORDEN ID.
      // Lo guardaremos en BD (Payment.externalId).
      providerPaymentId: result.id,
      paymentUrl: result.init_point, // URL generado por Mercado Pago
    };
  }

  async handleWebhook(
    body: any,
    headers: Record<string, string>, // headers sirve para configurar opciones adicionales de la solicitud.  Record<string, string> es un tipo de TypeScript que representa un objeto con claves de tipo string y valores de tipo string.
  ): Promise<WebhookValidationResult> {
    // Verificar firma HMAC-SHA256 del webhook
    const webhookSecret = this.config.payments.mercadopago.webhookSecret;


    // 1. Verificar firma HMAC-SHA256 del webhook
    if (webhookSecret) {
      const xSignature = headers['x-signature'] || ''; // x-signature es un header que contiene la firma del webhook.
      const xRequestId = headers['x-request-id'] || ''; // x-request-id es un header que contiene el ID de la solicitud.

      // Extraer ts y v1 del header x-signature
      const parts = xSignature.split(','); // parts es un array que contiene los diferentes valores del header x-signature.
      const tsMatch = parts.find((p) => p.trim().startsWith('ts=')); // tsMatch es el valor del header x-signature que contiene el timestamp.
      const v1Match = parts.find((p) => p.trim().startsWith('v1=')); // v1Match es el valor del header x-signature que contiene la versión.

      if (tsMatch && v1Match) {
        const ts = tsMatch.split('=')[1]; // ts es el valor del header x-signature que contiene el timestamp.
        const v1 = v1Match.split('=')[1]; // v1 es el valor del header x-signature que contiene la versión.

        const dataId = body?.data?.id || ''; // dataId es el ID de la transacción.
        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`; // manifest es el valor del header x-signature que contiene el timestamp.
        const computedHash = crypto  // computedHash es el hash calculado del webhook.
          .createHmac('sha256', webhookSecret) // createHmac es una función de la librería crypto que crea un objeto HMAC.
          .update(manifest) // update es una función de la librería crypto que actualiza el objeto HMAC.
          .digest('hex'); // digest es una función de la librería crypto que calcula el hash del objeto HMAC.

        if (computedHash !== v1) { // Si el hash calculado no coincide con el hash del header x-signature, se considera inválido.
          this.logger.warn('Firma de webhook MercadoPago inválida');
          return { isValid: false };
        }
      }
    }

    // 2. Solo procesamos notificaciones de tipo payment
    if (body.type !== 'payment' || !body.data?.id) {
      return { isValid: false };
    }

    // 3. Consultar el estado del pago en MercadoPago
    const paymentApi = new MPPayment(this.client); // paymentApi es una instancia de la clase MPPayment que se utiliza para interactuar con la API de Mercado Pago.
    // Aquí consultamos a MercadoPago usando EL ID QUE ELLOS GENERARON y que nos llega en el webhook (body.data.id).
    const payment = await paymentApi.get({ id: body.data.id });

    const statusMap: Record<string, WebhookValidationResult['status']> = { // statusMap es un objeto que mapea los estados de Mercado Pago a los estados de la aplicación.
      approved: 'approved',
      rejected: 'rejected',
      pending: 'pending',
      in_process: 'pending',
      cancelled: 'cancelled',
    };

    return {
      isValid: true,
      // ¡OJO! Aquí devolvemos NUESTRO ID DE ORDEN (que nosotros les mandamos en external_reference al crear el pago).
      // NO estamos devolviendo el ID de MercadoPago. Esto permite buscar en BD la orden correcta.
      originalOrdenId: payment.external_reference,
      status: statusMap[payment.status] || 'pending', // es el estado del pago
      rawData: payment as unknown as Record<string, any>, // rawData es el objeto que contiene todos los datos del pago.
    };
  }

  async getPaymentStatus(externalId: string): Promise<string> {
    const paymentApi = new MPPayment(this.client); // paymentApi es una instancia de la clase MPPayment que se utiliza para interactuar con la API de Mercado Pago.
    try {
      const payment = await paymentApi.get({ id: Number(externalId) }); // payment es el resultado de la solicitud a la API de Mercado Pago.  get({ id: Number(externalId) }) es un método de la clase MPPayment que se utiliza para obtener el estado de un pago.
      return payment.status || 'unknown'; // payment.status es el estado del pago. 'unknown' es el estado por defecto si el estado no se encuentra.
    } catch {
      return 'unknown';
    }
  }
}
