import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExchangeRate } from '../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService implements OnModuleInit {
    private readonly logger = new Logger(ExchangeRateService.name);
    private readonly API_URL = 'https://open.er-api.com/v6/latest/USD';

    constructor(
        @InjectModel(ExchangeRate.name) private exchangeRateModel: Model<ExchangeRate>,
        private readonly httpService: HttpService,
    ) { }

    async onModuleInit() {
        this.logger.log('Inicializando ExchangeRateService...');
        // Ejecutar una actualización al inicio si la DB está vacía o desactualizada
        const count = await this.exchangeRateModel.countDocuments();
        if (count === 0) {
            await this.updateRates();
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.log('Ejecutando Cron Job: Actualización de tasas de cambio');
        await this.updateRates();
    }

    async updateRates(): Promise<void> {
        try {
            const { data } = await firstValueFrom(this.httpService.get(this.API_URL));

            if (!data || !data.rates) {
                throw new Error('Formato de respuesta API inválido');
            }

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
                    upsert: true,
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

    async getRate(targetCurrency: string): Promise<number> {
        // Si es USD, la tasa es 1
        if (targetCurrency === 'USD') return 1;

        const rateDoc = await this.exchangeRateModel.findOne({ currencyCode: targetCurrency }).exec();
        return rateDoc ? rateDoc.rate : 1; // Fallback a 1 si no encuentra
    }
}
