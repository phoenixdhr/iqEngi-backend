import { Module } from '@nestjs/common';
import { CuestionarioRespuestaController } from './controllers/cuestionario-respuesta.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { RespuestaCuestionarioResolver } from './resolvers/respuesta-cuestionario.resolver';
import { CuestionarioRespuestaService } from './services/cuestionario-respuesta.service';
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
    CuestionarioRespuestaService,
    RespuestaCuestionarioResolver,
    RespuestaPreguntaService,
    RespuestaPreguntaResolver,
  ],
  controllers: [CuestionarioRespuestaController],
  exports: [CuestionarioRespuestaService],
})
export class CuestionarioRespuestaModule {}
