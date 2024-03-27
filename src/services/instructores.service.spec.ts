import { Test, TestingModule } from '@nestjs/testing';
import { InstructoresService } from './instructores.service';

describe('InstructoresService', () => {
  let service: InstructoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructoresService],
    }).compile();

    service = module.get<InstructoresService>(InstructoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
