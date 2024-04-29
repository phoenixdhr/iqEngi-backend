import { Test, TestingModule } from '@nestjs/testing';
import { EstructuraProgramariaService } from './estructura-programaria.service';

describe('ServicesService', () => {
  let service: EstructuraProgramariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstructuraProgramariaService],
    }).compile();

    service = module.get<EstructuraProgramariaService>(
      EstructuraProgramariaService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
