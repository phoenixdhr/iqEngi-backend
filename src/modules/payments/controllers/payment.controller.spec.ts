import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from '../services/payment.service';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';
import configEnv from 'src/common/enviroments/configEnv';

describe('PaymentController', () => {
  let controller: PaymentController;

  const mockPaymentService = {
    procesarWebhook: jest.fn(),
  };

  const mockConfig = {
    dominioFrontend: 'http://localhost:4321',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: configEnv.KEY, useValue: mockConfig },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('webhookMercadoPago', () => {
    it('debe procesar webhook y responder 200', async () => {
      const mockReq = {
        body: { type: 'payment', data: { id: '123' } },
        headers: { 'x-signature': 'abc' },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockPaymentService.procesarWebhook.mockResolvedValue(undefined);

      await controller.webhookMercadoPago(mockReq as any, mockRes as any);

      expect(mockPaymentService.procesarWebhook).toHaveBeenCalledWith(
        MetodoPago.MERCADOPAGO,
        mockReq.body,
        mockReq.headers,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('OK');
    });

    it('debe responder 200 incluso si hay error', async () => {
      const mockReq = {
        body: {},
        headers: {},
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockPaymentService.procesarWebhook.mockRejectedValue(
        new Error('Test error'),
      );

      await controller.webhookMercadoPago(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('return URLs', () => {
    it('debe redirigir a confirmación en success', () => {
      const mockRes = { redirect: jest.fn() };
      controller.returnSuccess('abc123', mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:4321/checkout/confirmacion?orden_id=abc123',
      );
    });

    it('debe redirigir a cancelación en cancel', () => {
      const mockRes = { redirect: jest.fn() };
      controller.returnCancel('abc123', mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:4321/checkout/cancelacion?orden_id=abc123',
      );
    });

    it('debe redirigir a pendiente en pending', () => {
      const mockRes = { redirect: jest.fn() };
      controller.returnPending('abc123', mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:4321/checkout/pendiente?orden_id=abc123',
      );
    });
  });
});
