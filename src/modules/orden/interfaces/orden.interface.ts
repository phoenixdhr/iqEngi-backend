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

// orden/interfaces/orden.interface.ts

import { Types } from 'mongoose';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { IdInterface } from 'src/common/interfaces/id.interface';

// Interfaz que define la estructura de cada curso dentro de una orden
export interface ICursosItemOrden {
  cursoId: Types.ObjectId;
  precio?: number;
  courseTitle?: string;
  descuento?: number;
  // Moneda en la que se registró el precio del curso (código ISO 4217)
  currency?: string;
}

// Interfaz principal de la orden de compra
export interface IOrden extends IdInterface {
  _id: Types.ObjectId;
  usuarioId?: Types.ObjectId;
  listaCursos: Array<ICursosItemOrden>;
  montoTotal?: number;
  estado_orden?: EstadoOrden;
  // Moneda en la que se realizó la transacción (código ISO 4217)
  currency?: string;
  paymentProvider?: string;
  externalPaymentId?: string;
  paymentUrl?: string;
  paymentProvider?: string;
  // NOTA: Por el momento este campo no se está utilizando ni guardando en ningún lado.
  checkoutSessionId?: string;
  expiresAt?: Date;
}

export type IOrdenInput = Omit<IOrden, '_id' | 'fechaCreacion'>;
