import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { PaymentService } from './payment.service';
import { Payment } from '../entities/payment.entity';
import { MercadoPagoStrategy } from '../strategies/mercadopago.strategy';
import { DLocalStrategy } from '../strategies/dlocal.strategy';
import { BitPayStrategy } from '../strategies/bitpay.strategy';
import { OrdenService } from 'src/modules/orden/services/orden.service';
import { CursoCompradoService } from 'src/modules/curso-comprado/services/curso-comprado.service';
import { MailService } from 'src/modules/mail/mail.service';
import { MetodoPago } from 'src/common/enums/metodo-pago.enum';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';
import configEnv from 'src/common/enviroments/configEnv';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockPaymentModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    db: {
      collection: jest.fn().mockReturnValue({
        updateOne: jest.fn(),
      }),
    },
  };

  const mockMercadoPagoStrategy = {
    createPayment: jest.fn(),
    handleWebhook: jest.fn(),
    getPaymentStatus: jest.fn(),
  };

  const mockDLocalStrategy = {
    createPayment: jest.fn(),
    handleWebhook: jest.fn(),
    getPaymentStatus: jest.fn(),
  };

  const mockBitPayStrategy = {
    createPayment: jest.fn(),
    handleWebhook: jest.fn(),
    getPaymentStatus: jest.fn(),
  };

  const mockOrdenService = {
    _create: jest.fn(),
    findById: jest.fn(),
  };

  const mockCursoCompradoService = {
    create: jest.fn(),
  };

  const mockMailService = {
    sendPaymentConfirmationEmail: jest.fn(),
  };

  const mockConfig = {
    dominioAPI: 'http://localhost:3000',
    dominioFrontend: 'http://localhost:4321',
    payments: {
      mercadopago: { accessToken: 'test', webhookSecret: 'test' },
      dlocal: {
        apiUrl: 'https://sandbox.dlocal.com',
        xLogin: 'test',
        xTransKey: 'test',
        secretKey: 'test',
      },
      bitpay: { token: 'test', environment: 'test' },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getModelToken(Payment.name), useValue: mockPaymentModel },
        { provide: MercadoPagoStrategy, useValue: mockMercadoPagoStrategy },
        { provide: DLocalStrategy, useValue: mockDLocalStrategy },
        { provide: BitPayStrategy, useValue: mockBitPayStrategy },
        { provide: OrdenService, useValue: mockOrdenService },
        { provide: CursoCompradoService, useValue: mockCursoCompradoService },
        { provide: MailService, useValue: mockMailService },
        { provide: configEnv.KEY, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('iniciarPago', () => {
    it('debe crear orden, payment y retornar paymentUrl con MercadoPago', async () => {
      const userId = new Types.ObjectId();
      const cursoId = new Types.ObjectId();
      const ordenId = new Types.ObjectId();

      const mockOrden = {
        _id: ordenId,
        montoTotal: 49.99,
        listaCursos: [{ cursoId, courseTitle: 'Curso Test', precio: 49.99 }],
      };

      const mockPayment = {
        _id: new Types.ObjectId(),
        ordenId,
        save: jest.fn(),
        externalId: undefined,
        paymentUrl: undefined,
        status: EstadoPago.Pendiente,
      };

      mockOrdenService._create.mockResolvedValue(mockOrden);
      mockPaymentModel.create.mockResolvedValue(mockPayment);
      mockMercadoPagoStrategy.createPayment.mockResolvedValue({
        externalId: 'mp-pref-123',
        paymentUrl: 'https://mercadopago.com/checkout/123',
      });

      const result = await service.iniciarPago(
        {
          cursosIds: [cursoId],
          metodoPago: MetodoPago.MERCADOPAGO,
          currency: 'PEN',
        },
        userId,
        'test@test.com',
      );

      expect(mockOrdenService._create).toHaveBeenCalledWith(
        [expect.any(Types.ObjectId)],
        userId,
      );
      expect(mockPaymentModel.create).toHaveBeenCalled();
      expect(mockMercadoPagoStrategy.createPayment).toHaveBeenCalled();
      expect(mockPayment.save).toHaveBeenCalled();
      expect(result.externalId).toBe('mp-pref-123');
      expect(result.paymentUrl).toBe('https://mercadopago.com/checkout/123');
    });
  });

  describe('procesarWebhook', () => {
    it('debe ignorar webhooks inválidos', async () => {
      mockMercadoPagoStrategy.handleWebhook.mockResolvedValue({
        isValid: false,
      });

      await service.procesarWebhook(
        MetodoPago.MERCADOPAGO,
        { type: 'payment' },
        {},
      );

      expect(mockPaymentModel.findOne).not.toHaveBeenCalled();
    });

    it('debe procesar webhook aprobado y completar pago', async () => {
      const ordenId = new Types.ObjectId();
      const usuarioId = new Types.ObjectId();
      const cursoId = new Types.ObjectId();

      const mockPayment = {
        _id: new Types.ObjectId(),
        ordenId,
        usuarioId,
        status: EstadoPago.EnProceso,
        save: jest.fn(),
        webhookData: undefined,
      };

      const mockOrden = {
        _id: ordenId,
        listaCursos: [
          { cursoId, courseTitle: 'Test', precio: 10 },
        ],
        montoTotal: 10,
        currency: 'USD',
      };

      mockMercadoPagoStrategy.handleWebhook.mockResolvedValue({
        isValid: true,
        externalId: ordenId.toString(),
        status: 'approved',
        rawData: { id: 123 },
      });

      mockPaymentModel.findOne.mockResolvedValue(mockPayment);
      mockOrdenService.findById.mockResolvedValue(mockOrden);
      mockCursoCompradoService.create.mockResolvedValue({});
      mockMailService.sendPaymentConfirmationEmail.mockResolvedValue(undefined);

      await service.procesarWebhook(
        MetodoPago.MERCADOPAGO,
        { type: 'payment', data: { id: 123 } },
        {},
      );

      expect(mockPayment.status).toBe(EstadoPago.Aprobado);
      expect(mockPayment.save).toHaveBeenCalled();
      expect(mockCursoCompradoService.create).toHaveBeenCalled();
    });

    it('debe ser idempotente con pagos ya aprobados', async () => {
      const ordenId = new Types.ObjectId();

      const mockPayment = {
        _id: new Types.ObjectId(),
        ordenId,
        status: EstadoPago.Aprobado,
        save: jest.fn(),
      };

      mockMercadoPagoStrategy.handleWebhook.mockResolvedValue({
        isValid: true,
        externalId: ordenId.toString(),
        status: 'approved',
      });

      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      await service.procesarWebhook(
        MetodoPago.MERCADOPAGO,
        { type: 'payment', data: { id: 123 } },
        {},
      );

      // No debe guardar ni procesar de nuevo
      expect(mockPayment.save).not.toHaveBeenCalled();
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar el pago si existe', async () => {
      const paymentId = new Types.ObjectId();
      const mockPayment = { _id: paymentId, status: EstadoPago.Aprobado };
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      const result = await service.obtenerPorId(paymentId);
      expect(result).toEqual(mockPayment);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockPaymentModel.findOne.mockResolvedValue(null);

      await expect(
        service.obtenerPorId(new Types.ObjectId()),
      ).rejects.toThrow('no encontrado');
    });
  });

  describe('obtenerHistorial', () => {
    it('debe retornar pagos del usuario', async () => {
      const userId = new Types.ObjectId();
      const mockPayments = [{ _id: new Types.ObjectId() }];

      mockPaymentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockPayments),
            }),
          }),
        }),
      });

      const result = await service.obtenerHistorial(userId);
      expect(result).toEqual(mockPayments);
    });
  });
});
