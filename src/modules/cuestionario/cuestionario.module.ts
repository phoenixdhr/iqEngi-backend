import { Module } from '@nestjs/common';
import { CuestionarioService } from './services/cuestionario.service';
import { CuestionarioController } from './controllers/cuestionario.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { CuestionarioResolver } from './resolvers/cuestionario.resolver';
import {
  Cuestionario,
  CuestionarioSchema,
} from './entities/cuestionario.entity';
import { Pregunta, PreguntaSchema } from './entities/pregunta.entity';
import { Opcion, OpcionSchema } from './entities/opcion.entity';
import { OpcionService } from './services/opcion.service';
import { OpcionResolver } from './resolvers/opcion.resolver';
import { CursoModule } from '../curso/curso.module';
import { PreguntaService } from './services/pregunta.service';
import { PreguntaResolver } from './resolvers/pregunta.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cuestionario.name, schema: CuestionarioSchema },
      { name: Pregunta.name, schema: PreguntaSchema },
      { name: Opcion.name, schema: OpcionSchema },
    ]),
    CursoModule, // Agrega CursoModule aquí
  ],
  providers: [
    CuestionarioService,
    CuestionarioResolver,
    PreguntaResolver,
    PreguntaService,
    OpcionService,
    OpcionResolver,
  ],
  controllers: [CuestionarioController],
  exports: [CuestionarioService, PreguntaService, OpcionService],
})
export class CuestionarioModule {}
