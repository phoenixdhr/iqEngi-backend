import { Test, TestingModule } from '@nestjs/testing';
import { CursoCompradoService } from './services/curso-comprado.service';

describe('CursoCompradoService', () => {
  let service: CursoCompradoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursoCompradoService],
    }).compile();

    service = module.get<CursoCompradoService>(CursoCompradoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
