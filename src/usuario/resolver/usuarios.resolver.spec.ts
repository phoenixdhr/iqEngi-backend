import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioResolver } from './usuario.resolver';

describe('ResolverResolver', () => {
  let resolver: UsuarioResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioResolver],
    }).compile();

    resolver = module.get<UsuarioResolver>(UsuarioResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
