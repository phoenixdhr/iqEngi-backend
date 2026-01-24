// src/modules/newsletter/services/newsletter.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Newsletter } from '../entities/newsletter.entity';
import { CreateSubscriberInput } from '../dtos/create-subscriber.input';
import { SubscriptionResponseOutput } from '../dtos/subscription-response.output';
import { NewsletterSource } from '../interfaces/newsletter.interface';

/**
 * Servicio que maneja toda la lógica de negocio relacionada con el Newsletter.
 * 
 * Funcionalidades principales:
 * - Suscripción (con manejo de duplicados y reactivación).
 * - Desuscripción (soft delete mediante isActive: false).
 * - Consulta de suscriptores activos.
 */
@Injectable()
export class NewsletterService {
    private readonly logger = new Logger(NewsletterService.name);

    constructor(
        @InjectModel(Newsletter.name)
        private readonly newsletterModel: Model<Newsletter>,
    ) { }

    // ═══════════════════════════════════════════════════════════════════
    // SUSCRIPCIÓN
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Suscribe un email al newsletter.
     * 
     * Comportamiento:
     * - Si el email no existe: Crea un nuevo registro.
     * - Si el email existe y está activo: Retorna mensaje "Ya estás suscrito".
     * - Si el email existe y está inactivo: Lo reactiva.
     * 
     * @param input - Datos del suscriptor (email requerido, name opcional).
     * @returns Respuesta con el estado de la operación.
     */
    async subscribe(input: CreateSubscriberInput): Promise<SubscriptionResponseOutput> {
        const emailNormalized = input.email.toLowerCase().trim();

        try {
            // Buscar si ya existe un registro con este email
            const existingSubscriber = await this.newsletterModel.findOne({ email: emailNormalized });

            if (existingSubscriber) {
                // Caso 1: Ya está suscrito y activo
                if (existingSubscriber.isActive) {
                    this.logger.log(`Email ya suscrito: ${emailNormalized}`);
                    return {
                        success: true,
                        message: '¡Ya estás suscrito a nuestro newsletter!',
                        email: emailNormalized,
                    };
                }

                // Caso 2: Estaba desuscrito, lo reactivamos
                existingSubscriber.isActive = true;
                existingSubscriber.unsubscribedAt = undefined;
                // Actualizar nombre si se proporcionó uno nuevo
                if (input.name) {
                    existingSubscriber.name = input.name;
                }
                await existingSubscriber.save();

                this.logger.log(`Suscriptor reactivado: ${emailNormalized}`);
                return {
                    success: true,
                    message: '¡Bienvenido de vuelta! Te has vuelto a suscribir.',
                    email: emailNormalized,
                };
            }

            // Caso 3: Email nuevo, crear registro
            const newSubscriber = new this.newsletterModel({
                email: emailNormalized,
                name: input.name?.trim(),
                source: input.source || NewsletterSource.WEB_FOOTER,
                isActive: true,
            });

            await newSubscriber.save();
            this.logger.log(`Nueva suscripción creada: ${emailNormalized}`);

            return {
                success: true,
                message: '¡Gracias por suscribirte! Pronto recibirás novedades.',
                email: emailNormalized,
            };

        } catch (error) {
            this.logger.error(`Error al suscribir ${emailNormalized}: ${error.message}`);
            return {
                success: false,
                message: 'Hubo un error al procesar tu suscripción. Inténtalo de nuevo.',
                email: emailNormalized,
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // DESUSCRIPCIÓN
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Desuscribe un email del newsletter (soft delete).
     * 
     * No elimina el registro, solo marca isActive: false para:
     * - Mantener historial.
     * - Respetar la preferencia del usuario de no recibir correos.
     * - Evitar re-suscripciones accidentales.
     * 
     * @param email - Email a desuscribir.
     * @returns Estado de la operación.
     */
    async unsubscribe(email: string): Promise<SubscriptionResponseOutput> {
        const emailNormalized = email.toLowerCase().trim();

        try {
            const subscriber = await this.newsletterModel.findOne({ email: emailNormalized });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Este email no está registrado en nuestra lista.',
                    email: emailNormalized,
                };
            }

            if (!subscriber.isActive) {
                return {
                    success: true,
                    message: 'Ya te habías dado de baja anteriormente.',
                    email: emailNormalized,
                };
            }

            // Marcar como inactivo
            subscriber.isActive = false;
            subscriber.unsubscribedAt = new Date();
            await subscriber.save();

            this.logger.log(`Desuscripción procesada: ${emailNormalized}`);
            return {
                success: true,
                message: 'Te has dado de baja exitosamente. Ya no recibirás más correos.',
                email: emailNormalized,
            };

        } catch (error) {
            this.logger.error(`Error al desuscribir ${emailNormalized}: ${error.message}`);
            return {
                success: false,
                message: 'Hubo un error al procesar tu solicitud.',
                email: emailNormalized,
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // CONSULTAS (Para uso administrativo)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Obtiene todos los suscriptores activos.
     * Útil para exportar lista de correos para campañas.
     * 
     * @returns Lista de suscriptores activos.
     */
    async findAllActive(): Promise<Newsletter[]> {
        return this.newsletterModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();
    }

    /**
     * Obtiene el conteo de suscriptores activos.
     * Útil para métricas en el dashboard de administración.
     * 
     * @returns Número de suscriptores activos.
     */
    async countActive(): Promise<number> {
        return this.newsletterModel.countDocuments({ isActive: true }).exec();
    }

    /**
     * Vincula un suscriptor existente con un usuario registrado.
     * Se llama cuando un usuario crea una cuenta y su email ya estaba suscrito.
     * 
     * @param email - Email del suscriptor.
     * @param userId - ID del usuario a vincular.
     */
    async linkToUser(email: string, userId: Types.ObjectId): Promise<void> {
        const emailNormalized = email.toLowerCase().trim();
        await this.newsletterModel.updateOne(
            { email: emailNormalized },
            { $set: { userId } },
        );
        this.logger.log(`Suscriptor ${emailNormalized} vinculado a usuario ${userId}`);
    }

    /**
     * Suscribe a un usuario registrado al newsletter.
     * Se usa cuando el usuario marca "Quiero recibir noticias" al crear su cuenta.
     * 
     * @param email - Email del usuario.
     * @param userId - ID del usuario.
     * @param name - Nombre del usuario (opcional).
     */
    async subscribeFromUserRegistration(
        email: string,
        userId: Types.ObjectId,
        name?: string,
    ): Promise<void> {
        const input: CreateSubscriberInput = {
            email,
            name,
            source: NewsletterSource.REGISTER_FORM,
        };

        await this.subscribe(input);
        await this.linkToUser(email, userId);
    }
}
