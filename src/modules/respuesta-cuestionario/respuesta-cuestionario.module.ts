import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RespuestaCuestionario.name,
        schema: RespuestaCuestionarioSchema,
      },
      { name: RespuestaPregunta.name, schema: RespuestaPreguntaSchema },
    ]),
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
