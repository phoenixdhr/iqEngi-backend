// src/modules/newsletter/resolvers/newsletter.resolver.ts

import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Newsletter } from '../entities/newsletter.entity';
import { NewsletterService } from '../services/newsletter.service';
import { CreateSubscriberInput } from '../dtos/create-subscriber.input';
import { SubscriptionResponseOutput } from '../dtos/subscription-response.output';

// Guards y decoradores de autenticación
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { IsPublic } from 'src/modules/auth/decorators/public.decorator';
import { administradorUp } from 'src/common/enums/rol.enum';

/**
 * Resolver GraphQL para el módulo Newsletter.
 * 
 * Expone las siguientes operaciones:
 * - Mutations públicas: subscribeToNewsletter, unsubscribeFromNewsletter
 * - Queries privadas (Admin): allActiveSubscribers, activeSubscribersCount
 */
@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => Newsletter)
export class NewsletterResolver {
    constructor(private readonly newsletterService: NewsletterService) { }

    // ═══════════════════════════════════════════════════════════════════
    // MUTATIONS PÚBLICAS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Suscribe un email al newsletter.
     * Endpoint PÚBLICO - No requiere autenticación.
     * 
     * @param input - Email y nombre opcional del suscriptor.
     * @returns Respuesta con estado y mensaje de la operación.
     */
    @Mutation(() => SubscriptionResponseOutput, {
        name: 'Newsletter_subscribe',
        description: 'Suscribirse al newsletter (público)',
    })
    @IsPublic()
    async subscribeToNewsletter(
        @Args('input') input: CreateSubscriberInput,
    ): Promise<SubscriptionResponseOutput> {
        return this.newsletterService.subscribe(input);
    }

    /**
     * Desuscribe un email del newsletter.
     * Endpoint PÚBLICO - No requiere autenticación.
     * 
     * Se usa desde el link de "Unsubscribe" en los correos enviados.
     * 
     * @param email - Email a desuscribir.
     * @returns Respuesta con estado y mensaje de la operación.
     */
    @Mutation(() => SubscriptionResponseOutput, {
        name: 'Newsletter_unsubscribe',
        description: 'Darse de baja del newsletter (público)',
    })
    @IsPublic()
    async unsubscribeFromNewsletter(
        @Args('email') email: string,
    ): Promise<SubscriptionResponseOutput> {
        return this.newsletterService.unsubscribe(email);
    }

    // ═══════════════════════════════════════════════════════════════════
    // QUERIES ADMINISTRATIVAS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Obtiene todos los suscriptores activos.
     * Solo accesible por ADMINISTRADOR y SUPERADMIN.
     * 
     * @returns Lista de suscriptores activos.
     */
    @Query(() => [Newsletter], {
        name: 'Newsletter_allActive',
        description: 'Lista de suscriptores activos (admin)',
    })
    @RolesDec(...administradorUp)
    async allActiveSubscribers(): Promise<Newsletter[]> {
        return this.newsletterService.findAllActive();
    }

    /**
     * Obtiene el conteo de suscriptores activos.
     * Solo accesible por ADMINISTRADOR y SUPERADMIN.
     * Útil para métricas en el dashboard.
     * 
     * @returns Número total de suscriptores activos.
     */
    @Query(() => Int, {
        name: 'Newsletter_countActive',
        description: 'Total de suscriptores activos (admin)',
    })
    @RolesDec(...administradorUp)
    async activeSubscribersCount(): Promise<number> {
        return this.newsletterService.countActive();
    }
}
