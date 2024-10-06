// import { Module } from '@nestjs/common';
// import { SeedService } from './seed.service';
// import { SeedResolver } from './seed.resolver';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   Categoria,
//   CategoriaSchema,
// } from 'src/categoria/entities/categoria.entity';
// import {
//   Comentario,
//   ComentarioSchema,
// } from 'src/comentario/entities/comentario.entity';
// import {
//   Cuestionario,
//   CuestionarioSchema,
//   Pregunta,
//   PreguntaSchema,
// } from 'src/modules/cuestionario/entities/cuestionario.entity';
// import {
//   CuestionarioRespuestaUsuario,
//   CuestionarioRespuestaUsuarioSchema,
//   RespuestaUsuario,
//   RespuestaUsuarioSchema,
// } from 'src/modules/respuesta-cuestionario-usuario/entities/cuestionario-respuesta-usuario.entity';
// import { Curso, CursoSchema } from 'src/modules/curso/entities/curso.entity';
// import {
//   EstructuraProgramaria,
//   EstructuraProgramariaSchema,
//   UnidadEducativa,
//   UnidadEducativaSchema,
// } from 'src/modules/------estructura-programaria/entities/estructura-programaria.entity';
// import {
//   Instructor,
//   InstructorSchema,
// } from 'src/instructor/entities/instructor.entity';
// import { Orden, OrdenSchema } from 'src/modules/orden/entities/orden.entity';
// import {
//   ProgresoCurso,
//   ProgresoCursoSchema,
// } from 'src/modules/------progreso-curso/entities/progreso-curso.entity';
// import {
//   CursoComprado,
//   CursoCompradoSchema,
//   Perfil,
//   PerfilSchema,
//   Usuario,
//   UsuarioSchema,
// } from 'src/modules/usuario/entities/usuario.entity';
// import { UsuarioModule } from 'src/modules/usuario/usuario.module';
// import { CategoriaModule } from 'src/categoria/categoria.module';
// import { InstructorModule } from 'src/instructor/instructor.module';
// import { ComentarioModule } from 'src/comentario/comentario.module';
// import { ProgresoCursoModule } from 'src/modules/------progreso-curso/progreso-curso.module';
// import { OrdenModule } from 'src/modules/orden/orden.module';
// import { EstructuraProgramariaModule } from 'src/modules/------estructura-programaria/estructura-programaria.module';
// import { CuestionarioModule } from 'src/modules/cuestionario/cuestionario.module';
// import { CursoModule } from 'src/modules/curso/curso.module';
// import { CuestionarioRespuestaModule } from 'src/modules/cuestionario-respuesta/cuestionario-respuesta.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Categoria.name, schema: CategoriaSchema },
//       { name: Comentario.name, schema: ComentarioSchema },
//       { name: Cuestionario.name, schema: CuestionarioSchema },
//       { name: Pregunta.name, schema: PreguntaSchema },

//       {
//         name: CuestionarioRespuestaUsuario.name,
//         schema: CuestionarioRespuestaUsuarioSchema,
//       },
//       { name: RespuestaUsuario.name, schema: RespuestaUsuarioSchema },

//       { name: Curso.name, schema: CursoSchema },
//       { name: EstructuraProgramaria.name, schema: EstructuraProgramariaSchema },
//       { name: UnidadEducativa.name, schema: UnidadEducativaSchema },

//       { name: Instructor.name, schema: InstructorSchema },
//       { name: Orden.name, schema: OrdenSchema },
//       { name: ProgresoCurso.name, schema: ProgresoCursoSchema },
//       { name: Usuario.name, schema: UsuarioSchema },
//       { name: Perfil.name, schema: PerfilSchema },
//       { name: CursoComprado.name, schema: CursoCompradoSchema },
//     ]),
//     UsuarioModule,
//     CategoriaModule,
//     InstructorModule,
//     ComentarioModule,
//     CuestionarioRespuestaModule,
//     CuestionarioModule,
//     CursoModule,
//     EstructuraProgramariaModule,
//     OrdenModule,
//     ProgresoCursoModule,
//   ],
//   providers: [SeedResolver, SeedService],
// })
// export class SeedModule {}
