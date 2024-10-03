import { Test, TestingModule } from '@nestjs/testing';
import { ProgresoCursoController } from './progreso-curso.controller';

describe('ProgresoCursosController', () => {
  let controller: ProgresoCursoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgresoCursoController],
    }).compile();

    controller = module.get<ProgresoCursoController>(ProgresoCursoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
