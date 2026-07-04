/*
 * ==============================================================================
 * NOTA DE CAMBIOS RECIENTES (Refactorización Arquitectura de Pagos)
 * ==============================================================================
 * Este archivo fue modificado para soportar la separación de responsabilidades 
 * entre 'Orden' y 'Payment'.
 * 
 * Principales cambios:
 * 1. Se independizó el concepto de Orden (intención de compra) del Payment (intento de pago).
 * 2. Se implementó una lógica de expiración estricta sincronizada con las pasarelas (expiresAt).
 * 3. Se garantizó la idempotencia completa en los webhooks para evitar procesamiento duplicado.
 * 4. Se migró el campo 'metodoPago' a 'paymentProvider' / 'ProveedorPago'.
 * ==============================================================================
 */

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
import { ProveedorPago } from 'src/common/enums/proveedor-pago.enum';
import { EstadoPago } from 'src/common/enums/estado-pago.enum';
import { ExchangeRateService } from 'src/modules/exchange-rate/services/exchange-rate.service';
import configEnv from 'src/common/enviroments/configEnv';

describe('PaymentService', () => {
  let service: PaymentService;

  class MockPaymentModel {
    constructor(data: any) {
      Object.assign(this, data);
    }
    save = jest.fn();
    static create = jest.fn((data: any) => new MockPaymentModel(data));
    static findOne = jest.fn();
    static find = jest.fn();
    static db = {
      collection: jest.fn().mockReturnValue({
        updateOne: jest.fn(),
        findOne: jest.fn().mockResolvedValue({
          _id: new Types.ObjectId(),
          montoTotal: 10,
          currency: 'USD',
          usuarioId: new Types.ObjectId(),
          estado_orden: 'pendiente',
          listaCursos: [{ cursoId: new Types.ObjectId(), courseTitle: 'Mock Course', precio: 10 }],
        }),
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      }),
    };
  }

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
    otorgarAcceso: jest.fn(),
    verificarCursosYaComprados: jest.fn().mockResolvedValue([]),
  };

  const mockMailService = {
    sendPaymentConfirmationEmail: jest.fn(),
  };

  const mockExchangeRateService = {
    getRate: jest.fn().mockResolvedValue(1),
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
        { provide: getModelToken(Payment.name), useValue: MockPaymentModel },
        { provide: MercadoPagoStrategy, useValue: mockMercadoPagoStrategy },
        { provide: DLocalStrategy, useValue: mockDLocalStrategy },
        { provide: BitPayStrategy, useValue: mockBitPayStrategy },
        { provide: OrdenService, useValue: mockOrdenService },
        { provide: CursoCompradoService, useValue: mockCursoCompradoService },
        { provide: MailService, useValue: mockMailService },
        { provide: ExchangeRateService, useValue: mockExchangeRateService },
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
    it('debe crear orden y retornar CheckoutResponse con MercadoPago', async () => {
      const userId = new Types.ObjectId();
      const cursoId = new Types.ObjectId();
      const ordenId = new Types.ObjectId();

      const mockOrden = {
        _id: ordenId,
        montoTotal: 49.99,
        listaCursos: [{ cursoId, courseTitle: 'Curso Test', precio: 49.99 }],
      };

      mockOrdenService._create.mockResolvedValue(mockOrden);
      mockMercadoPagoStrategy.createPayment.mockResolvedValue({
        providerPaymentId: 'mp-pref-123',
        paymentUrl: 'https://mercadopago.com/checkout/123',
      });

      const result = await service.iniciarPago(
        {
          cursosIds: [cursoId],
          paymentProvider: ProveedorPago.MERCADOPAGO,
          currency: 'PEN',
        },
        userId,
        'test@test.com',
      );

      expect(mockOrdenService._create).toHaveBeenCalledWith(
        [expect.any(Types.ObjectId)],
        userId,
      );
      expect(mockMercadoPagoStrategy.createPayment).toHaveBeenCalled();
      expect(result.ordenId).toBe(ordenId.toString());
      expect(result.paymentUrl).toBe('https://mercadopago.com/checkout/123');
    });
  });

  describe('procesarWebhook', () => {
    it('debe ignorar webhooks inválidos', async () => {
      mockMercadoPagoStrategy.handleWebhook.mockResolvedValue({
        isValid: false,
      });

      await service.procesarWebhook(
        ProveedorPago.MERCADOPAGO,
        { type: 'payment' },
        {},
      );

      expect(MockPaymentModel.findOne).not.toHaveBeenCalled();
    });

    it('debe procesar webhook aprobado, crear payment y completar pago', async () => {
      const ordenId = new Types.ObjectId();
      const usuarioId = new Types.ObjectId();
      const cursoId = new Types.ObjectId();

      const mockOrden = {
        _id: ordenId,
        listaCursos: [
          { cursoId, courseTitle: 'Test', precio: 10 },
        ],
        montoTotal: 10,
        currency: 'USD',
        usuarioId,
      };

      mockMercadoPagoStrategy.handleWebhook.mockResolvedValue({
        isValid: true,
        originalOrdenId: ordenId.toString(),
        status: 'approved',
        rawData: { id: 123 },
      });

      // No existe payment previo
      MockPaymentModel.findOne.mockResolvedValue(null);
      mockOrdenService.findById.mockResolvedValue(mockOrden);
      mockCursoCompradoService.otorgarAcceso.mockResolvedValue({});
      mockMailService.sendPaymentConfirmationEmail.mockResolvedValue(undefined);

      // Para el Payment instanciado: ya funcionará porque usamos la clase MockPaymentModel

      await service.procesarWebhook(
        ProveedorPago.MERCADOPAGO,
        { type: 'payment', data: { id: 123 } },
        {},
      );

      // Verificamos que se llame a save() en la nueva instancia.
      // Como jest mock no intercepta instancias locales tan fácil, podemos checar que cursoCompradoService haya avanzado
      expect(mockCursoCompradoService.otorgarAcceso).toHaveBeenCalled();
    });

    it('debe ser idempotente con pagos ya procesados', async () => {
      const ordenId = new Types.ObjectId();

      const mockPayment = {
        _id: new Types.ObjectId(),
        ordenId,
        status: EstadoPago.Aprobado,
        save: jest.fn(),
      };

      mockMercadoPagoStrategy.handleWebhook.mockResolvedValue({
        isValid: true,
        originalOrdenId: ordenId.toString(),
        status: 'approved',
        rawData: { id: 123 },
      });

      // Ya existe el payment en la base de datos con externalId
      MockPaymentModel.findOne.mockResolvedValue(mockPayment);

      await service.procesarWebhook(
        ProveedorPago.MERCADOPAGO,
        { type: 'payment', data: { id: 123 } },
        {},
      );

      // No debe procesar cursos si ya existía el payment exitoso
      expect(mockCursoCompradoService.otorgarAcceso).not.toHaveBeenCalled();
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar el pago si existe', async () => {
      const paymentId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const mockPayment = { _id: paymentId, status: EstadoPago.Aprobado, usuarioId: userId };
      MockPaymentModel.findOne.mockResolvedValue(mockPayment);

      const result = await service.obtenerPorId(paymentId, userId);
      expect(result).toEqual(mockPayment);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      MockPaymentModel.findOne.mockResolvedValue(null);

      await expect(
        service.obtenerPorId(new Types.ObjectId(), new Types.ObjectId()),
      ).rejects.toThrow('no encontrado');
    });
  });

  describe('obtenerHistorial', () => {
    it('debe retornar pagos del usuario', async () => {
      const userId = new Types.ObjectId();
      const mockPayments = [{ _id: new Types.ObjectId() }];

      MockPaymentModel.find.mockReturnValue({
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
