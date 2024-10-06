import { Test, TestingModule } from '@nestjs/testing';
import { CursoCompradoController } from './controllers/curso-comprado.controller';

describe('CursoCompradoController', () => {
  let controller: CursoCompradoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursoCompradoController],
    }).compile();

    controller = module.get<CursoCompradoController>(CursoCompradoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
