import { Test, TestingModule } from '@nestjs/testing';
import { ProgresoCursoService } from './progreso-curso.service';

describe('ProgresoCursosService', () => {
  let service: ProgresoCursoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgresoCursoService],
    }).compile();

    service = module.get<ProgresoCursoService>(ProgresoCursoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
