import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { ComentariosModule } from 'src/comentarios/comentarios.module';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { CuestionarioRespuestaUsuarioModule } from 'src/cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';
import { ProgresoCursosModule } from 'src/progreso-cursos/progreso-cursos.module';

@Module({
  imports: [
    ComentariosModule,
    OrdenesModule,
    CuestionarioRespuestaUsuarioModule,
    ProgresoCursosModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
