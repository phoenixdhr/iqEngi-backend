import { Test, TestingModule } from '@nestjs/testing';
import { MongooseUtilsService } from './_mongoose-utils-service.service';

describe('MongooseUtilsServiceService', () => {
  let service: MongooseUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseUtilsService],
    }).compile();

    service = module.get<MongooseUtilsService>(MongooseUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
