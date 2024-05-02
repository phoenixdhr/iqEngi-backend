import { Test, TestingModule } from '@nestjs/testing';
import { CuestionarioRespuestaUsuarioService } from './cuestionario-respuesta-usuario.service';

describe('CuestionarioRespuestaUsuarioService', () => {
  let service: CuestionarioRespuestaUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuestionarioRespuestaUsuarioService],
    }).compile();

    service = module.get<CuestionarioRespuestaUsuarioService>(
      CuestionarioRespuestaUsuarioService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
