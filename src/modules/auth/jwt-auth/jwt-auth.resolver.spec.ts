import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthResolver } from './jwt-auth.resolver';

describe('JwtAuthResolver', () => {
  let resolver: JwtAuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthResolver],
    }).compile();

    resolver = module.get<JwtAuthResolver>(JwtAuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
