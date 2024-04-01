import { Test, TestingModule } from '@nestjs/testing';
import { CuestionarioRespuestaUsuarioController } from './cuestionario-respuesta-usuario.controller';

describe('CuestionarioRespuestaUsuarioController', () => {
  let controller: CuestionarioRespuestaUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuestionarioRespuestaUsuarioController],
    }).compile();

    controller = module.get<CuestionarioRespuestaUsuarioController>(CuestionarioRespuestaUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
