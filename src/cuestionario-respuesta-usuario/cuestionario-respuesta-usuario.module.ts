import { Module } from '@nestjs/common';
import { CuestionarioRespuestaUsuarioService } from './services/cuestionario-respuesta-usuario.service';
import { CuestionarioRespuestaUsuarioController } from './controllers/cuestionario-respuesta-usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CuestionarioRespuestaUsuario,
  CuestionarioRespuestaUsuarioSchema,
} from './entities/cuestionario-respuesta-usuario.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CuestionarioRespuestaUsuario.name,
        schema: CuestionarioRespuestaUsuarioSchema,
      },
    ]),
  ],
  providers: [CuestionarioRespuestaUsuarioService],
  controllers: [CuestionarioRespuestaUsuarioController],
  exports: [CuestionarioRespuestaUsuarioService],
})
export class CuestionarioRespuestaUsuarioModule {}
