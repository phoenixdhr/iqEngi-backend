import { Test, TestingModule } from '@nestjs/testing';
import { InstructoresController } from './instructores.controller';

describe('InstructoresController', () => {
  let controller: InstructoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructoresController],
    }).compile();

    controller = module.get<InstructoresController>(InstructoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
