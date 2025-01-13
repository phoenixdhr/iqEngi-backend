import { Module } from '@nestjs/common';
import { OrdenController } from './controllers/orden.controller';
import { OrdenService } from './services/orden.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orden, OrdenSchema } from './entities/orden.entity';
import { OrdenResolver } from './resolvers/orden.resolver';
import { Curso, CursoSchema } from '../curso/entities/curso.entity';
import { OrdenArrayCursoResolver } from './resolvers/ordenArrayCursoItem.resolver';
import { OrdenArrayCursoService } from './services/ordenArrayCursoItem.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orden.name, schema: OrdenSchema },
      { name: Curso.name, schema: CursoSchema }, // Registro del modelo Curso
    ]),

    // forwardRef(() => CursoModule),
  ],
  controllers: [OrdenController],
  providers: [
    OrdenService,
    OrdenResolver,
    OrdenArrayCursoService,
    OrdenArrayCursoResolver,
  ],
  exports: [OrdenService],
})
export class OrdenModule {}
