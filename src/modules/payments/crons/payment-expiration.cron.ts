/* MODIFICACIONES DESDE EL 贚TIMO COMMIT:
 * - Mejoras en el job de cron para limpiar 髍denes expiradas de forma m醩 segura.
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

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentService } from '../services/payment.service';

@Injectable()
export class PaymentExpirationCron {
  private readonly logger = new Logger(PaymentExpirationCron.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Red de seguridad: cada hora, expira 贸rdenes cuyo expiresAt haya vencido.
   * Cubre el escenario donde el usuario abandon贸 el checkout.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredOrders(): Promise<void> {
    this.logger.log('Ejecutando limpieza de 贸rdenes expiradas...');
    const count = await this.paymentService.cancelarOrdenesExpiradas();
    this.logger.log(`Limpieza completada. ${count} orden(es) expirada(s).`);
  }
}

