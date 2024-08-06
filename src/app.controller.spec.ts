import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();
  });
});
