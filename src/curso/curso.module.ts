import { forwardRef, Module } from '@nestjs/common';
import { CursoController } from './controllers/curso.controller';
import { CursoService } from './services/curso.service';
import { ComentarioModule } from 'src/comentario/comentario.module';
import { OrdenModule } from 'src/orden/orden.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { EstructuraProgramariaModule } from 'src/estructura-programaria/estructura-programaria.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { CursoResolver } from './resolvers-gql/curso.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }]),
    forwardRef(() => OrdenModule),
    forwardRef(() => CategoriaModule),
    forwardRef(() => UsuarioModule),
    ComentarioModule,
    CuestionarioModule,
    InstructorModule,
    EstructuraProgramariaModule,
  ],
  controllers: [CursoController],
  providers: [CursoService, CursoResolver],
  exports: [CursoService],
})
export class CursoModule {}

//X OrdenesService
//X CategoriasService
//X ComentariosService
//X CuestionarioService
// InstructoresService
// EstructuraProgramariaService
// UsuariosService
