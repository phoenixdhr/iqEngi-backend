import { Test, TestingModule } from '@nestjs/testing';
import { EstructuraProgramariaController } from './estructura-programaria.controller';

describe('ControllersController', () => {
  let controller: EstructuraProgramariaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstructuraProgramariaController],
    }).compile();

    controller = module.get<EstructuraProgramariaController>(
      EstructuraProgramariaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
