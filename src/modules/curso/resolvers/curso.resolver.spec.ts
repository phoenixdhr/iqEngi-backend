import { Test, TestingModule } from '@nestjs/testing';
import { CursoResolver } from './curso.resolver';
import { CursoService } from '../services/curso.service';
import { getModelToken } from '@nestjs/mongoose';
import { CursoComprado } from '../../curso-comprado/entities/curso-comprado.entity';
import { RolEnum } from '../../../common/enums/rol.enum';
import { Types } from 'mongoose';
import { CursoOutput } from '../dtos/curso-dtos/curso.output';

describe('CursoResolver', () => {
    let resolver: CursoResolver;
    let service: CursoService;
    let cursoCompradoModel: any;

    const mockCurso = {
        _id: new Types.ObjectId(),
        courseTitle: 'Test Course',
        modulosIds: [new Types.ObjectId(), new Types.ObjectId()],
    } as CursoOutput;

    const mockCursoService = {
        findById: jest.fn().mockResolvedValue({ ...mockCurso }), // Return copy
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

    const mockCursoCompradoModel = {
        exists: jest.fn(),
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
            ],
        }).compile();

        resolver = module.get<CursoResolver>(CursoResolver);
        service = module.get<CursoService>(CursoService);
        cursoCompradoModel = module.get(getModelToken(CursoComprado.name));

        // Reset mocks
        jest.clearAllMocks();
    });

    describe('findById', () => {
        const cursoId = new Types.ObjectId();

        it('should return full course for Admin', async () => {
            const user = { _id: 'adminId', roles: [RolEnum.ADMINISTRADOR] };
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });

            const result = await resolver.findById(cursoId, user as any);

            expect(result.modulosIds).toHaveLength(2);
            expect(mockCursoCompradoModel.exists).not.toHaveBeenCalled();
        });

        it('should return restricted course for Guest (no user)', async () => {
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });

            const result = await resolver.findById(cursoId, undefined);

            expect(result.modulosIds).toHaveLength(0);
        });

        it('should return restricted course for Student who has NOT bought', async () => {
            const user = { _id: 'studentId', roles: [RolEnum.ESTUDIANTE] };
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });
            mockCursoCompradoModel.exists.mockResolvedValue(null); // Not bought

            const result = await resolver.findById(cursoId, user as any);

            expect(result.modulosIds).toHaveLength(0);
            expect(mockCursoCompradoModel.exists).toHaveBeenCalled();
        });

        it('should return full course for Student who HAS bought', async () => {
            const user = { _id: 'studentId', roles: [RolEnum.ESTUDIANTE] };
            mockCursoService.findById.mockResolvedValue({ ...mockCurso, modulosIds: [...mockCurso.modulosIds] });
            mockCursoCompradoModel.exists.mockResolvedValue({ _id: 'compraId' }); // Bought

            const result = await resolver.findById(cursoId, user as any);

            expect(result.modulosIds).toHaveLength(2);
            expect(mockCursoCompradoModel.exists).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should always return courses with empty modulosIds', async () => {
            mockCursoService.findAll.mockResolvedValue([{ ...mockCurso, modulosIds: [...mockCurso.modulosIds] }]);

            const result = await resolver.findAll();
            expect(result[0].modulosIds).toHaveLength(0);
        });
    });
});
