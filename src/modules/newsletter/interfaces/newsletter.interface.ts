// src/modules/newsletter/interfaces/newsletter.interface.ts

import { Types } from 'mongoose';
import { IdInterface } from 'src/common/interfaces/id.interface';

/**
 * Enum que define las posibles fuentes de suscripción.
 * Permite rastrear desde dónde se suscribió el usuario.
 */
export enum NewsletterSource {
    WEB_FOOTER = 'WEB_FOOTER',       // Formulario del footer de la página
    REGISTER_FORM = 'REGISTER_FORM', // Al crearse una cuenta de usuario
    MANUAL = 'MANUAL',               // Agregado manualmente por un admin
}

/**
 * Interface que define la estructura de un suscriptor del newsletter.
 */
export interface INewsletter extends IdInterface {
    _id: Types.ObjectId;
    email: string;                    // Email del suscriptor (único)
    name?: string;                    // Nombre opcional
    isActive: boolean;                // Si está activo (true) o desuscrito (false)
    source: NewsletterSource;         // De dónde vino la suscripción
    userId?: Types.ObjectId;          // Referencia opcional al usuario registrado
    unsubscribedAt?: Date;            // Fecha de desuscripción (si aplica)
}

/**
 * Type para la creación de un nuevo suscriptor (omitimos el _id).
 */
export type INewsletterInput = Omit<INewsletter, '_id'>;
