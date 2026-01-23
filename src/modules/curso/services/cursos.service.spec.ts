import { Test, TestingModule } from '@nestjs/testing';
import { CursoService } from './curso.service';
import { getModelToken } from '@nestjs/mongoose';
import { Curso } from '../entities/curso.entity';
import { Types } from 'mongoose';

describe('CursoService', () => {
  let service: CursoService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: any;

  const mockCurso = {
    _id: new Types.ObjectId(),
    courseTitle: 'Test Course',
    slug: 'test-course',
    deleted: false,
    categorias: [],
    instructor: new Types.ObjectId(),
  };

  const mockCursoModel = {
    findOne: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursoService,
        {
          provide: getModelToken(Curso.name),
          useValue: mockCursoModel,
        },
      ],
    }).compile();

    service = module.get<CursoService>(CursoService);
    model = module.get(getModelToken(Curso.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a course and populate instructor and categories', async () => {
      mockCursoModel.exec.mockResolvedValue(mockCurso);

      const result = await service.findById(mockCurso._id);

      expect(mockCursoModel.findOne).toHaveBeenCalledWith({
        _id: mockCurso._id,
        deleted: false,
      });
      expect(mockCursoModel.populate).toHaveBeenCalledWith({
        path: 'categorias',
        match: { deleted: false },
      });
      expect(mockCursoModel.populate).toHaveBeenCalledWith({
        path: 'instructor',
        match: { deleted: false },
      });
      expect(result).toEqual(mockCurso);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses and populate instructor and categories', async () => {
      mockCursoModel.exec.mockResolvedValue([mockCurso]);

      const pagination = { limit: 10, offset: 0 };
      const result = await service.findAll(pagination);

      expect(mockCursoModel.find).toHaveBeenCalledWith({ deleted: false });
      expect(mockCursoModel.skip).toHaveBeenCalledWith(pagination.offset);
      expect(mockCursoModel.limit).toHaveBeenCalledWith(pagination.limit);
      expect(mockCursoModel.populate).toHaveBeenCalledWith({
        path: 'categorias',
        match: { deleted: false },
      });
      expect(mockCursoModel.populate).toHaveBeenCalledWith({
        path: 'instructor',
        match: { deleted: false },
      });
      expect(result).toEqual([mockCurso]);
    });
  });
});
