import { Test, TestingModule } from '@nestjs/testing';
import { RespuestaPreguntaResolver } from '../respuesta-pregunta.resolver';

describe('RespuestaPreguntaResolver', () => {
  let resolver: RespuestaPreguntaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespuestaPreguntaResolver],
    }).compile();

    resolver = module.get<RespuestaPreguntaResolver>(RespuestaPreguntaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
