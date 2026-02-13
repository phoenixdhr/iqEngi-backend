// Tests unitarios para CursoResolver
// Verifica: acceso a cursos por roles, y conversión de precios por moneda

import { Test, TestingModule } from '@nestjs/testing';
import { CursoResolver } from './curso.resolver';
import { CursoService } from '../services/curso.service';
import { getModelToken } from '@nestjs/mongoose';
import { CursoComprado } from '../../curso-comprado/entities/curso-comprado.entity';
import { ExchangeRateService } from 'src/modules/exchange-rate/services/exchange-rate.service';
import { RolEnum } from '../../../common/enums/rol.enum';
import { Types } from 'mongoose';
import { CursoOutput } from '../dtos/curso-dtos/curso.output';

describe('CursoResolver', () => {
    let resolver: CursoResolver;
    let service: CursoService;
    let cursoCompradoModel: any;
    let exchangeRateService: ExchangeRateService;

    // Mock de curso base para reutilizar en los tests
    const mockCurso = {
        _id: new Types.ObjectId(),
        courseTitle: 'Test Course',
        modulosIds: [new Types.ObjectId(), new Types.ObjectId()],
        precio: 49.99,
        currency: 'USD',
    } as CursoOutput;

    // Mock del servicio CursoService
    const mockCursoService = {
        findById: jest.fn().mockResolvedValue({ ...mockCurso }),
        findAll: jest.fn().mockResolvedValue([{ ...mockCurso }]),
        findAllByTitle: jest.fn().mockResolvedValue([{ ...mockCurso }]),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        hardDelete: jest.fn(),
        hardDeleteAllSoftDeleted: jest.fn(),
        findSoftDeleted: jest.fn(),
        restore: jest.fn(),
        addCategorias: jest.fn(),
        removeCategorias: jest.fn(),
    };

    // Mock del modelo CursoComprado
    const mockCursoCompradoModel = {
        exists: jest.fn(),
    };

    // Mock del servicio ExchangeRateService
    const mockExchangeRateService = {
        getRate: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CursoResolver,
                {
                    provide: CursoService,
                    useValue: mockCursoService,
                },
                {
                    provide: getModelToken(CursoComprado.name),
                    useValue: mockCursoCompradoModel,
                },
                {
                    provide: ExchangeRateService,
                    useValue: mockExchangeRateService,
                },
            ],
        }).compile();

        resolver = module.get<CursoResolver>(CursoResolver);
        service = module.get<CursoService>(CursoService);
        cursoCompradoModel = module.get(getModelToken(CursoComprado.name));
        exchangeRateService = module.get<ExchangeRateService>(ExchangeRateService);

        // Limpiar mocks antes de cada test
        jest.clearAllMocks();
    });

    // --- Tests de acceso por roles ---
    describe('findById', () => {
        const cursoId = new Types.ObjectId();

        it('debe retornar curso completo para Administrador', async () => {
            const user = { _id: 'adminId', roles: [RolEnum.ADMINISTRADOR] };
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });

            const result = await resolver.findById(cursoId, user as any);

            expect(result.modulosIds).toHaveLength(2);
            expect(mockCursoCompradoModel.exists).not.toHaveBeenCalled();
        });

        it('debe retornar curso restringido para visitante (sin usuario)', async () => {
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });

            const result = await resolver.findById(cursoId, undefined);

            expect(result.modulosIds).toHaveLength(0);
        });

        it('debe retornar curso restringido para estudiante que NO ha comprado', async () => {
            const user = { _id: 'studentId', roles: [RolEnum.ESTUDIANTE] };
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });
            mockCursoCompradoModel.exists.mockResolvedValue(null);

            const result = await resolver.findById(cursoId, user as any);

            expect(result.modulosIds).toHaveLength(0);
            expect(mockCursoCompradoModel.exists).toHaveBeenCalled();
        });

        it('debe retornar curso completo para estudiante que SÍ ha comprado', async () => {
            const user = { _id: 'studentId', roles: [RolEnum.ESTUDIANTE] };
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });
            mockCursoCompradoModel.exists.mockResolvedValue({ _id: 'compraId' });

            const result = await resolver.findById(cursoId, user as any);

            expect(result.modulosIds).toHaveLength(2);
            expect(mockCursoCompradoModel.exists).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('debe retornar cursos con modulosIds vacíos (seguridad)', async () => {
            mockCursoService.findAll.mockResolvedValue([{ ...mockCurso, modulosIds: [...mockCurso.modulosIds] }]);

            const result = await resolver.findAll();
            expect(result[0].modulosIds).toHaveLength(0);
        });
    });

    // --- Tests de conversión de precios por moneda ---
    describe('precio (ResolveField)', () => {
        it('debe retornar el precio base cuando no se especifica moneda', async () => {
            const curso = { ...mockCurso, precio: 49.99 } as CursoOutput;

            const result = await resolver.precio(curso, undefined);

            // Sin moneda: retorna precio base, no consulta ExchangeRateService
            expect(result).toBe(49.99);
            expect(mockExchangeRateService.getRate).not.toHaveBeenCalled();
        });

        it('debe retornar el precio base cuando se solicita USD', async () => {
            const curso = { ...mockCurso, precio: 49.99 } as CursoOutput;

            const result = await resolver.precio(curso, 'USD');

            // USD es la moneda base: retorna directamente
            expect(result).toBe(49.99);
            expect(mockExchangeRateService.getRate).not.toHaveBeenCalled();
        });

        it('debe convertir el precio cuando se solicita PEN', async () => {
            const curso = { ...mockCurso, precio: 49.99 } as CursoOutput;
            // Simular tasa de cambio: 1 USD = 3.72 PEN
            mockExchangeRateService.getRate.mockResolvedValue(3.72);

            const result = await resolver.precio(curso, 'PEN');

            // Precio convertido: 49.99 * 3.72 = 185.9628, redondeado a 185.96
            expect(result).toBe(parseFloat((49.99 * 3.72).toFixed(2)));
            expect(mockExchangeRateService.getRate).toHaveBeenCalledWith('PEN');
        });

        it('debe convertir el precio cuando se solicita BRL', async () => {
            const curso = { ...mockCurso, precio: 100 } as CursoOutput;
            // Simular tasa: 1 USD = 5.10 BRL
            mockExchangeRateService.getRate.mockResolvedValue(5.10);

            const result = await resolver.precio(curso, 'BRL');

            expect(result).toBe(510.00);
            expect(mockExchangeRateService.getRate).toHaveBeenCalledWith('BRL');
        });

        it('debe retornar null cuando el precio del curso es null', async () => {
            const curso = { ...mockCurso, precio: null } as unknown as CursoOutput;

            const result = await resolver.precio(curso, 'PEN');

            expect(result).toBeNull();
            expect(mockExchangeRateService.getRate).not.toHaveBeenCalled();
        });
    });
});
