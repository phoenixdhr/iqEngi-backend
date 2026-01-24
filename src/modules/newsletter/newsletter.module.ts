// src/modules/newsletter/newsletter.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Newsletter, NewsletterSchema } from './entities/newsletter.entity';
import { NewsletterService } from './services/newsletter.service';
import { NewsletterResolver } from './resolvers/newsletter.resolver';

/**
 * Módulo de Newsletter para gestión de suscriptores al boletín.
 * 
 * Funcionalidades:
 * - Suscripción pública desde el frontend (footer, popups, etc.)
 * - Desuscripción (soft delete)
 * - Consultas administrativas para exportar listas
 * 
 * Exporta: NewsletterService (para que otros módulos puedan suscribir usuarios).
 */
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Newsletter.name, schema: NewsletterSchema },
        ]),
    ],
    providers: [NewsletterService, NewsletterResolver],
    exports: [NewsletterService], // Exportado para uso en UsuarioModule al registrar
})
export class NewsletterModule { }
