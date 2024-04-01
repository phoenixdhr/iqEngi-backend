import { Module } from '@nestjs/common';
import { OrdenesController } from './controllers/ordenes.controller';
import { OrdenesService } from './services/ordenes.service';

@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
