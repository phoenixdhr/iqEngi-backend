import { Test, TestingModule } from '@nestjs/testing';
import { RespuestaCuestionarioController } from './respuesta-cuestionario.controller';

describe('CuestionarioRespuestaUsuarioController', () => {
  let controller: RespuestaCuestionarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RespuestaCuestionarioController],
    }).compile();

    controller = module.get<RespuestaCuestionarioController>(
      RespuestaCuestionarioController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
