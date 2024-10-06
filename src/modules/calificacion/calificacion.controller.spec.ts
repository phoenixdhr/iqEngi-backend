import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionController } from './controllers/calificacion.controller';

describe('CalificacionController', () => {
  let controller: CalificacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionController],
    }).compile();

    controller = module.get<CalificacionController>(CalificacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
