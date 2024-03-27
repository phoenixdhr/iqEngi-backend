import { Test, TestingModule } from '@nestjs/testing';
import { ProgresoCursosController } from './progreso-cursos.controller';

describe('ProgresoCursosController', () => {
  let controller: ProgresoCursosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgresoCursosController],
    }).compile();

    controller = module.get<ProgresoCursosController>(ProgresoCursosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
