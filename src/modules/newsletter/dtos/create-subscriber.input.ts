// src/modules/newsletter/dtos/create-subscriber.input.ts

import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { NewsletterSource } from '../interfaces/newsletter.interface';

/**
 * DTO para crear una nueva suscripción al newsletter.
 * 
 * Validaciones:
 * - email: Requerido, debe ser un email válido.
 * - name: Opcional, máximo 100 caracteres.
 * - source: Opcional, se usa para tracking (default: WEB_FOOTER).
 */
@InputType()
export class CreateSubscriberInput {
    /**
     * Email del suscriptor. Se convertirá a minúsculas automáticamente en el schema.
     */
    @Field()
    @IsNotEmpty({ message: 'El email es requerido' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email: string;

    /**
     * Nombre del suscriptor para personalización de correos (opcional).
     */
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
    name?: string;

    /**
     * Fuente de la suscripción para análisis (opcional, default: WEB_FOOTER).
     */
    @Field(() => NewsletterSource, { nullable: true })
    @IsOptional()
    source?: NewsletterSource;
}
