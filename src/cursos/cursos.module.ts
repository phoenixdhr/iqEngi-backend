import { forwardRef, Module } from '@nestjs/common';
import { CursosController } from './controllers/cursos.controller';
import { CursosService } from './services/cursos.service';
import { ComentariosModule } from 'src/comentarios/comentarios.module';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { InstructoresModule } from 'src/instructores/instructores.module';
import { EstructuraProgramariaModule } from 'src/estructura-programaria/estructura-programaria.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }]),
    forwardRef(() => OrdenesModule),
    forwardRef(() => CategoriasModule),
    forwardRef(() => UsuariosModule),
    ComentariosModule,
    CuestionarioModule,
    InstructoresModule,
    EstructuraProgramariaModule,
  ],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}

//X OrdenesService
//X CategoriasService
//X ComentariosService
//X CuestionarioService
// InstructoresService
// EstructuraProgramariaService
// UsuariosService
