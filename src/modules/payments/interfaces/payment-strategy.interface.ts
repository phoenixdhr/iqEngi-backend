import { Types } from 'mongoose';

// Define los parámetros necesarios para iniciar un proceso de pago.
// Se utiliza en el método createPayment de las estrategias de pago para configurar la transacción.
export interface CreatePaymentParams {
  ordenId: Types.ObjectId;
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  successUrl: string; // URL de éxito
  cancelUrl: string; // URL de cancelación
  pendingUrl: string; // URL de pendiente
  idempotencyKey: string; // Clave de idempotencia
}

// Representa el resultado de una creación de pago exitosa.
// Se utiliza para devolver la URL de redirección de la pasarela y el ID de seguimiento externo.
export interface CreatePaymentResult {
  // ATENCIÓN: Este es el ID ÚNICO GENERADO POR EL PROVEEDOR (ej. el ID gigantesco de Mercado Pago).
  // Es distinto a nuestro _id de la Orden.
  providerPaymentId: string;
  paymentUrl: string;
}

// Estructura que contiene el resultado de la validación y el estado procesado de un webhook.
// Se utiliza en el método handleWebhook de las estrategias de pago para procesar notificaciones de la pasarela.
export interface WebhookValidationResult {
  isValid: boolean;
  // ATENCIÓN: A diferencia del anterior, aquí "originalOrdenId" representa
  // NUESTRO ID ORIGINAL DE LA ORDEN que el proveedor nos devuelve intacto
  // (por ejemplo, el campo external_reference de Mercado Pago).
  originalOrdenId?: string;
  status?: 'approved' | 'rejected' | 'pending' | 'cancelled';
  rawData?: Record<string, any>;
}


// Define el contrato que deben implementar todas las estrategias de pago.
// Incluye métodos para crear pagos, manejar webhooks y obtener el estado de un pago.
// createPayment: Crea un pago en la pasarela de pago.
// handleWebhook: Maneja las notificaciones de la pasarela de pago, cuando esta cambia el estado de un pago.
// getPaymentStatus: Obtiene el estado de un pago.
export interface PaymentStrategy {
  createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult>;
  handleWebhook(
    body: any,
    headers: Record<string, string>,
  ): Promise<WebhookValidationResult>;
  getPaymentStatus(externalId: string): Promise<string>;
}
