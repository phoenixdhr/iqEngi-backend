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
import { DatabaseModule } from './_database/database.module';
import { ConfigModule } from '@nestjs/config';
import { environment } from './_common/enviroments';
import configEnv from './_common/config';
import { configValidationSchema } from './_common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? environment[process.env.NODE_ENV]
        : '.env',
      isGlobal: true,
      load: [configEnv],
      validationSchema: configValidationSchema,
    }),
    CursosModule,
    CategoriasModule,
    UsuariosModule,
    InstructoresModule,
    OrdenesModule,
    ComentariosModule,
    ProgresoCursosModule,
    CuestionarioModule,
    CuestionarioRespuestaUsuarioModule,
    DatabaseModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
