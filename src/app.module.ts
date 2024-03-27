import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosController } from './controllers/cursos.controller';
import { CategoriasController } from './controllers/categorias.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { InstructoresController } from './controllers/instructores.controller';
import { OrdenesController } from './controllers/ordenes.controller';
import { ComentariosController } from './controllers/comentarios.controller';
import { ProgresoCursosController } from './controllers/progreso-cursos.controller';
import { CursosService } from './services/cursos.service';
import { CategoriasService } from './services/categorias.service';
import { UsuariosService } from './services/usuarios.service';
import { InstructoresService } from './services/instructores.service';
import { OrdenesService } from './services/ordenes.service';
import { ComentariosService } from './services/comentarios.service';
import { ProgresoCursosService } from './services/progreso-cursos.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    CursosController,
    CategoriasController,
    UsuariosController,
    InstructoresController,
    OrdenesController,
    ComentariosController,
    ProgresoCursosController,
  ],
  providers: [
    // Servicios
    AppService,
    CursosService,
    CategoriasService,
    UsuariosService,
    InstructoresService,
    OrdenesService,
    ComentariosService,
    ProgresoCursosService,
  ],
})
export class AppModule {}
