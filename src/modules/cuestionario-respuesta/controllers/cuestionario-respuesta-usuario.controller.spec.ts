import { Test, TestingModule } from '@nestjs/testing';
import { CuestionarioRespuestaController } from './cuestionario-respuesta.controller';

describe('CuestionarioRespuestaUsuarioController', () => {
  let controller: CuestionarioRespuestaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuestionarioRespuestaController],
    }).compile();

    controller = module.get<CuestionarioRespuestaController>(
      CuestionarioRespuestaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
