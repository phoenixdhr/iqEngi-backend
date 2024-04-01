import { Module } from '@nestjs/common';
import { CuestionarioRespuestaUsuarioService } from './services/cuestionario-respuesta-usuario.service';
import { CuestionarioRespuestaUsuarioController } from './controllers/cuestionario-respuesta-usuario.controller';

@Module({
  providers: [CuestionarioRespuestaUsuarioService],
  controllers: [CuestionarioRespuestaUsuarioController],
})
export class CuestionarioRespuestaUsuarioModule {}
