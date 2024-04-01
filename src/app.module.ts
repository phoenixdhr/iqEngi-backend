import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { InstructoresModule } from './instructores/instructores.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { ProgresoCursosModule } from './progreso-cursos/progreso-cursos.module';
import { CuestionarioModule } from './cuestionario/cuestionario.module';
import { CuestionarioRespuestaUsuarioModule } from './cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';

@Module({
  imports: [
    CursosModule,
    CategoriasModule,
    UsuariosModule,
    InstructoresModule,
    OrdenesModule,
    ComentariosModule,
    ProgresoCursosModule,
    CuestionarioModule,
    CuestionarioRespuestaUsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
