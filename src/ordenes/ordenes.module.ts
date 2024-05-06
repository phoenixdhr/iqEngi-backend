import { forwardRef, Module } from '@nestjs/common';
import { OrdenesController } from './controllers/ordenes.controller';
import { OrdenesService } from './services/ordenes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orden, OrdenSchema } from './entities/orden.entity';
import { CursosModule } from '../cursos/cursos.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orden.name, schema: OrdenSchema }]),
    forwardRef(() => CursosModule),
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [OrdenesService],
})
export class OrdenesModule {}
