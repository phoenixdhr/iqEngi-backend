// Tests unitarios para ExchangeRateService
// Verifica la obtención de tasas de cambio y la lógica de actualización

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { of, throwError } from 'rxjs';

describe('ExchangeRateService', () => {
    let service: ExchangeRateService;

    // Mock del Modelo de Mongoose para ExchangeRate
    const mockExchangeRateModel = {
        findOne: jest.fn(),
        countDocuments: jest.fn(),
        bulkWrite: jest.fn(),
    };

    // Mock del HttpService de NestJS (para peticiones HTTP)
    const mockHttpService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeRateService,
                {
                    provide: getModelToken(ExchangeRate.name),
                    useValue: mockExchangeRateModel,
                },
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<ExchangeRateService>(ExchangeRateService);

        // Limpiar mocks antes de cada test
        jest.clearAllMocks();
    });

    it('debe estar definido', () => {
        expect(service).toBeDefined();
    });

    // --- Tests para getRate ---
    describe('getRate', () => {
        it('debe retornar 1 para USD (moneda base, sin consulta a BD)', async () => {
            // Arrange & Act
            const rate = await service.getRate('USD');

            // Assert: USD siempre es 1, no debe consultar la BD
            expect(rate).toBe(1);
            expect(mockExchangeRateModel.findOne).not.toHaveBeenCalled();
        });

        it('debe retornar la tasa almacenada para PEN', async () => {
            // Arrange: simular tasa de PEN en BD
            const mockRateDoc = { currencyCode: 'PEN', rate: 3.72 };
            mockExchangeRateModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRateDoc),
            });

            // Act
            const rate = await service.getRate('PEN');

            // Assert
            expect(rate).toBe(3.72);
            expect(mockExchangeRateModel.findOne).toHaveBeenCalledWith({ currencyCode: 'PEN' });
        });

        it('debe retornar la tasa almacenada para MXN', async () => {
            // Arrange
            const mockRateDoc = { currencyCode: 'MXN', rate: 17.15 };
            mockExchangeRateModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRateDoc),
            });

            // Act
            const rate = await service.getRate('MXN');

            // Assert
            expect(rate).toBe(17.15);
        });

        it('debe retornar 1 como fallback para monedas no encontradas en BD', async () => {
            // Arrange: simular que la moneda no existe en BD
            mockExchangeRateModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            // Act
            const rate = await service.getRate('XYZ');

            // Assert: retorna 1 para no romper cálculos
            expect(rate).toBe(1);
        });
    });

    // --- Tests para updateRates ---
    describe('updateRates', () => {
        it('debe obtener tasas de la API y guardarlas en BD con bulkWrite', async () => {
            // Arrange: simular respuesta exitosa de la API
            const mockApiResponse = {
                data: {
                    rates: {
                        USD: 1,
                        PEN: 3.72,
                        EUR: 0.92,
                        MXN: 17.15,
                    },
                },
            };
            mockHttpService.get.mockReturnValue(of(mockApiResponse));
            mockExchangeRateModel.bulkWrite.mockResolvedValue({});

            // Act
            await service.updateRates();

            // Assert: debe llamar a bulkWrite con las operaciones correctas
            expect(mockHttpService.get).toHaveBeenCalled();
            expect(mockExchangeRateModel.bulkWrite).toHaveBeenCalled();

            // Verificar estructura de las operaciones
            const operations = mockExchangeRateModel.bulkWrite.mock.calls[0][0];
            expect(operations).toHaveLength(4); // 4 monedas
            expect(operations[0].updateOne.filter.currencyCode).toBe('USD');
            expect(operations[0].updateOne.update.$set.rate).toBe(1);
            expect(operations[0].updateOne.upsert).toBe(true);
        });

        it('debe manejar errores de la API sin lanzar excepción', async () => {
            // Arrange: simular error de red
            mockHttpService.get.mockReturnValue(throwError(() => new Error('Network Error')));

            // Act & Assert: no debe lanzar excepción (se captura internamente)
            await expect(service.updateRates()).resolves.toBeUndefined();
            expect(mockExchangeRateModel.bulkWrite).not.toHaveBeenCalled();
        });

        it('debe manejar respuesta API con formato inválido', async () => {
            // Arrange: respuesta sin campo 'rates'
            mockHttpService.get.mockReturnValue(of({ data: {} }));

            // Act & Assert: no debe lanzar excepción
            await expect(service.updateRates()).resolves.toBeUndefined();
            expect(mockExchangeRateModel.bulkWrite).not.toHaveBeenCalled();
        });
    });

    // --- Tests para onModuleInit ---
    describe('onModuleInit', () => {
        it('debe llamar a updateRates si la BD está vacía (cold start)', async () => {
            // Arrange: BD vacía
            mockExchangeRateModel.countDocuments.mockResolvedValue(0);
            // Mock de updateRates para evitar llamar a la API real
            const updateRatesSpy = jest.spyOn(service, 'updateRates').mockResolvedValue();

            // Act
            await service.onModuleInit();

            // Assert
            expect(mockExchangeRateModel.countDocuments).toHaveBeenCalled();
            expect(updateRatesSpy).toHaveBeenCalled();
        });

        it('no debe llamar a updateRates si la BD ya tiene datos', async () => {
            // Arrange: BD con datos
            mockExchangeRateModel.countDocuments.mockResolvedValue(150);
            const updateRatesSpy = jest.spyOn(service, 'updateRates').mockResolvedValue();

            // Act
            await service.onModuleInit();

            // Assert
            expect(updateRatesSpy).not.toHaveBeenCalled();
        });
    });
});
