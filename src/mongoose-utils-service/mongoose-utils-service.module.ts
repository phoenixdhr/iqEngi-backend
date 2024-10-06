// mongoose-utils.service.ts
import { Global, Module } from '@nestjs/common';

import { MongooseUtilsService } from './services/mongoose-utils-service.service';

@Global()
@Module({
  providers: [MongooseUtilsService],
  exports: [MongooseUtilsService],
})
export class MongooseUtilsServiceModule {}
