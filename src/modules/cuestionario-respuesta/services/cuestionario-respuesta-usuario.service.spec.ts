import { Test, TestingModule } from '@nestjs/testing';
import { CuestionarioRespuestaService } from './cuestionario-respuesta.service';

describe('CuestionarioRespuestaUsuarioService', () => {
  let service: CuestionarioRespuestaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuestionarioRespuestaService],
    }).compile();

    service = module.get<CuestionarioRespuestaService>(
      CuestionarioRespuestaService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
