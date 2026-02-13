import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExchangeRate } from '../entities/exchange-rate.entity';

/**
 * Servicio de Gestión de Tasas de Cambio.
 * * Responsabilidades:
 * 1. Sincronizar diariamente las tasas de cambio desde una API externa (Open Exchange Rates).
 * 2. Persistir la información en MongoDB para evitar latencia en consultas frecuentes.
 * 3. Proveer métodos eficientes de conversión para otros servicios o resolvers.
 */
@Injectable()
export class ExchangeRateService implements OnModuleInit {
    private readonly logger = new Logger(ExchangeRateService.name);
    // API pública gratuita. Base: USD (1 USD = X Currency)
    private readonly API_URL = 'https://open.er-api.com/v6/latest/USD';

    constructor(
        @InjectModel(ExchangeRate.name) private exchangeRateModel: Model<ExchangeRate>,
        private readonly httpService: HttpService,
    ) { }

/**
     * Hook de ciclo de vida (`OnModuleInit`).
     * Se ejecuta una sola vez cuando el módulo se carga.
     * * Estrategia "Cold Start":
     * Verifica si la base de datos está vacía. Si es así, fuerza una descarga inmediata 
     * de datos para no esperar hasta la medianoche (primer CRON) y evitar errores en 
     * las primeras peticiones.
     */
    async onModuleInit() {
        this.logger.log('Inicializando ExchangeRateService...');
        const count = await this.exchangeRateModel.countDocuments();
        if (count === 0) {
            await this.updateRates();
        }
    }

/**
     * Tarea Programada (Cron Job).
     * Frecuencia: Todos los días a las 00:00 (Medianoche).
     * Mantiene los precios actualizados automáticamente sin intervención humana.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.log('Ejecutando Cron Job: Actualización de tasas de cambio');
        await this.updateRates();
    }

/**
     * Núcleo de sincronización de datos.
     * Realiza una petición HTTP y actualiza masivamente la colección de MongoDB.
     * * Detalles técnicos:
     * - Convierte Observables (RxJS) a Promesas.
     * - Usa `bulkWrite` para rendimiento: realiza una sola operación de escritura en lugar de miles de `save()`.
     */
    async updateRates(): Promise<void> {
        try {
            // firstValueFrom convierte el Observable del HttpService en una Promesa estándar
            const { data } = await firstValueFrom(this.httpService.get(this.API_URL));

            if (!data || !data.rates) {
                throw new Error('Formato de respuesta API inválido');
            }

            // Transformamos el objeto de tasas en un array de operaciones de escritura para MongoDB
            const operations = Object.entries(data.rates).map(([currencyCode, rate]) => ({
                updateOne: {
                    filter: { currencyCode },
                    update: {
                        $set: {
                            currencyCode,
                            rate,
                            baseCurrency: 'USD',
                            lastUpdated: new Date(),
                        },
                    },
                    upsert: true, // Crea el documento si no existe
                },
            }));

            if (operations.length > 0) {
                await this.exchangeRateModel.bulkWrite(operations);
                this.logger.log(`Tasas actualizadas: ${operations.length} monedas procesadas.`);
            }
        } catch (error) {
            this.logger.error('Error actualizando tasas de cambio', error);
        }
    }

/**
     * Obtiene el multiplicador de conversión para una moneda dada.
     * * Optimizaciones:
     * 1. Short-circuit: Si piden 'USD', retorna 1 inmediatamente (sin ir a la BD).
     * 2. Fail-safe: Si la moneda no existe (ej. código inválido), retorna 1 para no romper el cálculo de precios.
     * * @param targetCurrency Código ISO de la moneda (ej. 'MXN', 'EUR').
     */
    async getRate(targetCurrency: string): Promise<number> {
        // La moneda base es USD, por lo que su tasa siempre es 1
        if (targetCurrency === 'USD') return 1;

        const rateDoc = await this.exchangeRateModel.findOne({ currencyCode: targetCurrency }).exec();
        
        // Retorna la tasa encontrada o 1 como valor de respaldo (fallback)
        return rateDoc ? rateDoc.rate : 1;
    }
}
