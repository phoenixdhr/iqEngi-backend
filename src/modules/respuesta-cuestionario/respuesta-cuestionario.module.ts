import { forwardRef, Module } from '@nestjs/common';
import { RespuestaCuestionarioController } from './controllers/respuesta-cuestionario.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { RespuestaCuestionarioResolver } from './resolvers/respuesta-cuestionario.resolver';
import { RespuestaCuestionarioService } from './services/respuesta-cuestionario.service';
import {
  RespuestaCuestionario,
  RespuestaCuestionarioSchema,
} from './entities/respuesta-cuestionario.entity';
import {
  RespuestaPregunta,
  RespuestaPreguntaUsuarioSchema as RespuestaPreguntaSchema,
} from './entities/respuesta-pregunta.entity';
import { RespuestaPreguntaService } from './services/respuesta-pregunta.service';
import { RespuestaPreguntaResolver } from './resolvers/respuesta-pregunta.resolver';
import { CursoModule } from '../curso/curso.module';
import { CuestionarioModule } from '../cuestionario/cuestionario.module';
import { CursoCompradoModule } from '../curso-comprado/curso-comprado.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { Cuestionario } from '../cuestionario/entities/cuestionario.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RespuestaCuestionario.name,
        schema: RespuestaCuestionarioSchema,
      },
      { name: RespuestaPregunta.name, schema: RespuestaPreguntaSchema },
      { name: Cuestionario.name, schema: RespuestaPreguntaSchema },
    ]),
    CursoModule,
    CuestionarioModule,
    forwardRef(() => CursoCompradoModule),
    forwardRef(() => UsuarioModule),
  ],
  providers: [
    RespuestaCuestionarioService,
    RespuestaCuestionarioResolver,
    RespuestaPreguntaService,
    RespuestaPreguntaResolver,
  ],
  controllers: [RespuestaCuestionarioController],
  exports: [RespuestaCuestionarioService],
})
export class RespuestaCuestionarioModule {}
