import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentService } from '../services/payment.service';

@Injectable()
export class PaymentExpirationCron {
  private readonly logger = new Logger(PaymentExpirationCron.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Red de seguridad: cada hora, cancela payments cuyo expiresAt haya vencido.
   * Cubre el escenario donde el webhook de la pasarela no llegó o falló.
   *
   * Frecuencia: cada hora (suficiente para limpiar sin sobrecargar la BD).
   * Los webhooks siguen siendo la fuente primaria de cancelación/expiración.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredPayments(): Promise<void> {
    this.logger.log('Ejecutando limpieza de pagos expirados...');
    const count = await this.paymentService.cancelarPagosExpirados();
    this.logger.log(`Limpieza completada. ${count} pago(s) cancelado(s).`);
  }
}
