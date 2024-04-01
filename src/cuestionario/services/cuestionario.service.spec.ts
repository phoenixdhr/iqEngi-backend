import { Test, TestingModule } from '@nestjs/testing';
import { CuestionarioService } from './cuestionario.service';

describe('ServicesService', () => {
  let service: CuestionarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuestionarioService],
    }).compile();

    service = module.get<CuestionarioService>(CuestionarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
