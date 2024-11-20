import { Test, TestingModule } from '@nestjs/testing';
import { RespuestaCuestionarioService } from './respuesta-cuestionario.service';

describe('CuestionarioRespuestaUsuarioService', () => {
  let service: RespuestaCuestionarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespuestaCuestionarioService],
    }).compile();

    service = module.get<RespuestaCuestionarioService>(
      RespuestaCuestionarioService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
