import { Test, TestingModule } from '@nestjs/testing';
import { ProgresoCursosService } from './progreso-cursos.service';

describe('ProgresoCursosService', () => {
  let service: ProgresoCursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgresoCursosService],
    }).compile();

    service = module.get<ProgresoCursosService>(ProgresoCursosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
