import { Module } from '@nestjs/common';
import { OrdenesController } from './controllers/ordenes.controller';
import { OrdenesService } from './services/ordenes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orden, OrdenSchema } from './entities/orden.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orden.name, schema: OrdenSchema }]),
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [OrdenesService],
})
export class OrdenesModule {}
