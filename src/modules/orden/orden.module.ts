import { forwardRef, Module } from '@nestjs/common';
import { OrdenController } from './controllers/orden.controller';
import { OrdenService } from './services/orden.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orden, OrdenSchema } from './entities/orden.entity';
import { CursoModule } from '../curso/curso.module';
import { OrdenResolver } from './resolvers/orden.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orden.name, schema: OrdenSchema }]),
    forwardRef(() => CursoModule),
  ],
  controllers: [OrdenController],
  providers: [OrdenService, OrdenResolver],
  exports: [OrdenService],
})
export class OrdenModule {}
