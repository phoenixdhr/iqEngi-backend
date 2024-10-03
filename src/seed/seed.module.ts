import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Categoria,
  CategoriaSchema,
} from 'src/categoria/entities/categoria.entity';
import {
  Comentario,
  ComentarioSchema,
} from 'src/comentario/entities/comentario.entity';
import {
  Cuestionario,
  CuestionarioSchema,
  Pregunta,
  PreguntaSchema,
} from 'src/cuestionario/entities/cuestionario.entity';
import {
  CuestionarioRespuestaUsuario,
  CuestionarioRespuestaUsuarioSchema,
  RespuestaUsuario,
  RespuestaUsuarioSchema,
} from 'src/cuestionario-respuesta-usuario/entities/cuestionario-respuesta-usuario.entity';
import { Curso, CursoSchema } from 'src/curso/entities/curso.entity';
import {
  EstructuraProgramaria,
  EstructuraProgramariaSchema,
  UnidadEducativa,
  UnidadEducativaSchema,
} from 'src/estructura-programaria/entities/estructura-programaria.entity';
import {
  Instructor,
  InstructorSchema,
} from 'src/instructor/entities/instructor.entity';
import { Orden, OrdenSchema } from 'src/orden/entities/orden.entity';
import {
  ProgresoCurso,
  ProgresoCursoSchema,
} from 'src/progreso-curso/entities/progreso-curso.entity';
import {
  CursoComprado,
  CursoCompradoSchema,
  Perfil,
  PerfilSchema,
  Usuario,
  UsuarioSchema,
} from 'src/usuario/entities/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { ComentarioModule } from 'src/comentario/comentario.module';
import { ProgresoCursoModule } from 'src/progreso-curso/progreso-curso.module';
import { OrdenModule } from 'src/orden/orden.module';
import { EstructuraProgramariaModule } from 'src/estructura-programaria/estructura-programaria.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { CursoModule } from 'src/curso/curso.module';
import { CuestionarioRespuestaUsuarioModule } from 'src/cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categoria.name, schema: CategoriaSchema },
      { name: Comentario.name, schema: ComentarioSchema },
      { name: Cuestionario.name, schema: CuestionarioSchema },
      { name: Pregunta.name, schema: PreguntaSchema },

      {
        name: CuestionarioRespuestaUsuario.name,
        schema: CuestionarioRespuestaUsuarioSchema,
      },
      { name: RespuestaUsuario.name, schema: RespuestaUsuarioSchema },

      { name: Curso.name, schema: CursoSchema },
      { name: EstructuraProgramaria.name, schema: EstructuraProgramariaSchema },
      { name: UnidadEducativa.name, schema: UnidadEducativaSchema },

      { name: Instructor.name, schema: InstructorSchema },
      { name: Orden.name, schema: OrdenSchema },
      { name: ProgresoCurso.name, schema: ProgresoCursoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Perfil.name, schema: PerfilSchema },
      { name: CursoComprado.name, schema: CursoCompradoSchema },
    ]),
    UsuarioModule,
    CategoriaModule,
    InstructorModule,
    ComentarioModule,
    CuestionarioRespuestaUsuarioModule,
    CuestionarioModule,
    CursoModule,
    EstructuraProgramariaModule,
    OrdenModule,
    ProgresoCursoModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
