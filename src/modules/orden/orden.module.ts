import { Module } from '@nestjs/common';
import { OrdenController } from './controllers/orden.controller';
import { OrdenService } from './services/orden.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orden, OrdenSchema } from './entities/orden.entity';
import { OrdenResolver } from './resolvers/orden.resolver';
import { Curso, CursoSchema } from '../curso/entities/curso.entity';
import { OrdenArrayCursoResolver } from './resolvers/ordenArrayCursoItem.resolver';
import { OrdenArrayCursoService } from './services/ordenArrayCursoItem.service';
import { CursoComprado, CursoCompradoSchema } from '../curso-comprado/entities/curso-comprado.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orden.name, schema: OrdenSchema },
      { name: Curso.name, schema: CursoSchema }, // Registro del modelo Curso
      { name: CursoComprado.name, schema: CursoCompradoSchema }
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
export class OrdenModule { }
