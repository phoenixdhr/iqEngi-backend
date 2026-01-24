// src/modules/newsletter/dtos/subscription-response.output.ts

import { Field, ObjectType } from '@nestjs/graphql';

/**
 * DTO de respuesta para operaciones de suscripción/desuscripción.
 * Proporciona feedback amigable al usuario sobre el resultado de la operación.
 */
@ObjectType()
export class SubscriptionResponseOutput {
    /**
     * Indica si la operación fue exitosa.
     */
    @Field()
    success: boolean;

    /**
     * Mensaje descriptivo del resultado de la operación.
     * Ejemplos: "¡Te has suscrito exitosamente!", "Ya estabas suscrito."
     */
    @Field()
    message: string;

    /**
     * Email asociado a la operación (para confirmación visual en el frontend).
     */
    @Field({ nullable: true })
    email?: string;
}
