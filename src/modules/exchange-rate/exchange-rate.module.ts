import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateService } from './services/exchange-rate.service';
import { ExchangeRate, ExchangeRateSchema } from './entities/exchange-rate.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ExchangeRate.name, schema: ExchangeRateSchema }]),
        HttpModule,
    ],
    providers: [ExchangeRateService],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule { }
