import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionResolver } from './resolvers/calificacion.resolver';

describe('CalificacionResolver', () => {
  let resolver: CalificacionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalificacionResolver],
    }).compile();

    resolver = module.get<CalificacionResolver>(CalificacionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
