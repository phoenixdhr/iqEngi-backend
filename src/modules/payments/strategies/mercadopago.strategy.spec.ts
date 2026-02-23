import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { MercadoPagoStrategy } from './mercadopago.strategy';
import configEnv from 'src/common/enviroments/configEnv';

// Mock del SDK de MercadoPago
jest.mock('mercadopago', () => {
  return {
    MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
    Preference: jest.fn().mockImplementation(() => ({
      create: jest.fn().mockResolvedValue({
        id: 'pref-123',
        init_point: 'https://mercadopago.com/checkout/pref-123',
      }),
    })),
    Payment: jest.fn().mockImplementation(() => ({
      get: jest.fn().mockResolvedValue({
        id: 12345,
        status: 'approved',
        external_reference: '507f1f77bcf86cd799439011',
      }),
    })),
  };
});

describe('MercadoPagoStrategy', () => {
  let strategy: MercadoPagoStrategy;

  const mockConfig = {
    payments: {
      mercadopago: {
        accessToken: 'TEST-token-123',
        webhookSecret: 'test-webhook-secret',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MercadoPagoStrategy,
        { provide: configEnv.KEY, useValue: mockConfig },
      ],
    }).compile();

    strategy = module.get<MercadoPagoStrategy>(MercadoPagoStrategy);
  });

  it('debe estar definido', () => {
    expect(strategy).toBeDefined();
  });

  describe('createPayment', () => {
    it('debe crear una preferencia y retornar paymentUrl', async () => {
      const result = await strategy.createPayment({
        ordenId: new Types.ObjectId(),
        amount: 49.99,
        currency: 'PEN',
        description: 'Orden IQEngi #123',
        customerEmail: 'test@test.com',
        successUrl: 'http://localhost:3000/payments/return/success',
        cancelUrl: 'http://localhost:3000/payments/return/cancel',
        pendingUrl: 'http://localhost:3000/payments/return/pending',
        idempotencyKey: 'test-key-123',
      });

      expect(result.externalId).toBe('pref-123');
      expect(result.paymentUrl).toBe(
        'https://mercadopago.com/checkout/pref-123',
      );
    });
  });

  describe('handleWebhook', () => {
    it('debe rechazar webhooks que no son de tipo payment', async () => {
      const result = await strategy.handleWebhook(
        { type: 'test', data: {} },
        {},
      );
      expect(result.isValid).toBe(false);
    });

    it('debe procesar webhook de tipo payment válido', async () => {
      const result = await strategy.handleWebhook(
        { type: 'payment', data: { id: 12345 } },
        {},
      );

      expect(result.isValid).toBe(true);
      expect(result.status).toBe('approved');
      expect(result.externalId).toBe('507f1f77bcf86cd799439011');
    });
  });
});
