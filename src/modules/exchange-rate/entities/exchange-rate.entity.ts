import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'exchange_rates' })
export class ExchangeRate extends Document {
    @Prop({ required: true, unique: true })
    currencyCode!: string; // Ej: "MXN"

    @Prop({ required: true, type: Number })
    rate!: number; // Tasa de conversión desde USD (ej. 20.50)

    @Prop({ required: true, default: 'USD' })
    baseCurrency!: string; // Ej: "USD"

    @Prop({ type: Date, default: Date.now })
    lastUpdated!: Date;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);

// Índices
ExchangeRateSchema.index({ currencyCode: 1 }, { unique: true });
