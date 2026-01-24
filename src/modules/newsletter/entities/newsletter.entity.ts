// src/modules/newsletter/entities/newsletter.entity.ts

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { INewsletter, NewsletterSource } from '../interfaces/newsletter.interface';

// Registrar el enum para GraphQL
registerEnumType(NewsletterSource, {
    name: 'NewsletterSource',
    description: 'Fuente de donde provino la suscripción',
});

/**
 * Entidad Newsletter que combina Mongoose Schema + GraphQL ObjectType.
 * Representa a un suscriptor del boletín de noticias.
 *
 * NOTA: No extendemos AuditFields porque no necesitamos soft delete,
 * ya que usamos el campo isActive para manejar desuscripciones.
 */
@ObjectType()
@Schema({ timestamps: true })
export class Newsletter implements INewsletter {
    @Field(() => ID)
    _id: Types.ObjectId;

    /**
     * Email del suscriptor - Campo único e indexado para búsquedas rápidas.
     */
    @Field()
    @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
    email: string;

    /**
     * Nombre opcional del suscriptor para personalización de correos.
     */
    @Field({ nullable: true })
    @Prop({ trim: true })
    name?: string;

    /**
     * Estado de la suscripción. False = Desuscrito.
     */
    @Field()
    @Prop({ default: true })
    isActive: boolean;

    /**
     * Origen de la suscripción para análisis y tracking.
     */
    @Field(() => NewsletterSource)
    @Prop({ type: String, enum: NewsletterSource, default: NewsletterSource.WEB_FOOTER })
    source: NewsletterSource;

    /**
     * Referencia opcional al usuario si tiene cuenta en la plataforma.
     */
    @Field(() => ID, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
    userId?: Types.ObjectId;

    /**
     * Fecha en la que el usuario se desuscribió (para historial).
     */
    @Field({ nullable: true })
    @Prop()
    unsubscribedAt?: Date;

    /**
     * Timestamps automáticos de Mongoose (createdAt, updatedAt).
     */
    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);

// Índice para búsquedas por estado activo
NewsletterSchema.index({ isActive: 1 });

// Índice compuesto para búsquedas de usuarios activos por source
NewsletterSchema.index({ source: 1, isActive: 1 });
