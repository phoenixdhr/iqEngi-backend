// import { Inject, Injectable } from '@nestjs/common';
// import { ConfigType } from '@nestjs/config';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import configEnv from 'src/common/enviroments/configEnv';
// import { Categoria } from 'src/categoria/entities/categoria.entity';
// import { Comentario } from 'src/comentario/entities/comentario.entity';
// import {
//   CuestionarioRespuestaUsuario,
//   RespuestaUsuario,
// } from 'src/modules/respuesta-cuestionario-usuario/entities/cuestionario-respuesta-usuario.entity';
// import {
//   Cuestionario,
//   Pregunta,
// } from 'src/modules/cuestionario/entities/cuestionario.entity';
// import { Curso } from 'src/modules/curso/entities/curso.entity';
// import {
//   EstructuraProgramaria,
//   UnidadEducativa,
// } from 'src/modules/------estructura-programaria/entities/estructura-programaria.entity';
// import { Instructor } from 'src/instructor/entities/instructor.entity';
// import { Orden } from 'src/modules/orden/entities/orden.entity';
// import { ProgresoCurso } from 'src/modules/------progreso-curso/entities/progreso-curso.entity';

// import {
//   CursoComprado,
//   Perfil,
//   Usuario,
// } from 'src/modules/usuario/entities/usuario.entity';
// import {
//   SEED_CATEGORIA,
//   SEED_COMENTARIO,
//   SEED_CUESTIONARIO,
//   SEED_CUESTIONARIORESPUESTAUSUARIO,
//   SEED_CURSO,
//   SEED_USUARIO,
// } from './data/seed-data';
// import { UsuarioService } from 'src/modules/usuario/services/usuario.service';
// import { CategoriaService } from 'src/categoria/services/categoria.service';
// import { CursoService } from 'src/modules/curso/services/curso.service';
// import { ComentarioService } from 'src/comentario/services/comentario.service';
// import { CuestionarioRespuestaUsuarioService } from 'src/modules/respuesta-cuestionario-usuario/services/cuestionario-respuesta-usuario.service';
// import { CuestionarioService } from 'src/modules/cuestionario/services/cuestionario.service';
// import { EstructuraProgramariaService } from 'src/modules/------estructura-programaria/services/estructura-programaria.service';
// import { InstructorService } from 'src/instructor/services/instructor.service';
// import { OrdenService } from 'src/modules/orden/services/orden.service';
// import { ProgresoCursoService } from 'src/modules/------progreso-curso/services/progreso-curso.service';
// import { UnidadEducativaService } from 'src/modules/------estructura-programaria/services/unidad-educativa.service';
// @Injectable()
// export class SeedService {
//   private readonly isProd: boolean;

//   constructor(
//     @Inject(configEnv.KEY) readonly configService: ConfigType<typeof configEnv>,

//     @InjectModel(Categoria.name)
//     private readonly categoriaModel: Model<Categoria>,
//     @InjectModel(Comentario.name)
//     private readonly comentarioModel: Model<Comentario>,
//     @InjectModel(Cuestionario.name)
//     private readonly cuestionarioModel: Model<Cuestionario>,
//     @InjectModel(Pregunta.name) private readonly preguntaModel: Model<Pregunta>,

//     @InjectModel(CuestionarioRespuestaUsuario.name)
//     private readonly cuestionarioRespuestaUsuarioModel: Model<CuestionarioRespuestaUsuario>,
//     @InjectModel(RespuestaUsuario.name)
//     private readonly respuestaUsuarioModel: Model<RespuestaUsuario>,

//     @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,
//     @InjectModel(EstructuraProgramaria.name)
//     private readonly estructuraProgramariaModel: Model<EstructuraProgramaria>,
//     @InjectModel(UnidadEducativa.name)
//     private readonly unidadEducativaModel: Model<UnidadEducativa>,
//     @InjectModel(Instructor.name)
//     private readonly instructorModel: Model<Instructor>,
//     @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>,
//     @InjectModel(ProgresoCurso.name)
//     private readonly progresoCursoModel: Model<ProgresoCurso>,
//     @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
//     @InjectModel(CursoComprado.name)
//     private readonly cursoCompradoModel: Model<CursoComprado>,
//     @InjectModel(Perfil.name) private readonly perfilModel: Model<Perfil>,
//     private readonly usuarioService: UsuarioService,
//     private readonly categoriaService: CategoriaService,
//     private readonly cursoService: CursoService,
//     private readonly comentarioService: ComentarioService,
//     private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
//     private readonly cuestionarioService: CuestionarioService,
//     private readonly estructuraProgramariaService: EstructuraProgramariaService,
//     private readonly instructorService: InstructorService,
//     private readonly ordenService: OrdenService,
//     private readonly progresoCursoService: ProgresoCursoService,
//     private readonly unidadEducativaService: UnidadEducativaService,
//   ) {
//     this.isProd = this.configService.environment === 'prod';
//   }

//   async executeSeed() {
//     // Cero: No se puede ejecutar en producción
//     if (this.isProd) {
//       throw new Error('No puedes ejecutar seed en producción');
//     }

//     // Primero : Limpiar la base de datos
//     // this.cleanDatabase();
//     // Segundo : Crear usuarios
//     const user = await this.loadUsers();

//     // Tercero : Crear cursos, instructorres, etc

//     return true;
//   }

//   async cleanDatabase() {
//     this.categoriaModel.deleteMany({}).exec();
//     this.comentarioModel.deleteMany({}).exec();
//     this.cuestionarioModel.deleteMany({}).exec();
//     this.preguntaModel.deleteMany({}).exec();
//     this.cuestionarioRespuestaUsuarioModel.deleteMany({}).exec();
//     this.respuestaUsuarioModel.deleteMany({}).exec();
//     this.cursoModel.deleteMany({}).exec();
//     this.estructuraProgramariaModel.deleteMany({}).exec();
//     this.unidadEducativaModel.deleteMany({}).exec();
//     this.instructorModel.deleteMany({}).exec();
//     this.ordenModel.deleteMany({}).exec();
//     this.progresoCursoModel.deleteMany({}).exec();
//     this.usuarioModel.deleteMany({}).exec();
//     this.perfilModel.deleteMany({}).exec();
//     this.cursoCompradoModel.deleteMany({}).exec();
//   }

//   async loadUsers() {
//     const users = [];
//     for (const user of SEED_USUARIO) {
//       users.push(await this.usuarioService.create(user));
//     }
//     return users[0];
//   }

//   async loadCursos() {
//     const cursos = [];
//     for (const curso of SEED_CURSO) {
//       cursos.push(await this.cursoService.create(curso));
//     }
//     return cursos;
//   }

//   async loadCategorias() {
//     const categorias = [];
//     for (const categoria of SEED_CATEGORIA) {
//       categorias.push(await this.categoriaService.create(categoria));
//     }
//     return categorias;
//   }

//   async loadComentarios() {
//     const comentarios = [];
//     for (const comentario of SEED_COMENTARIO) {
//       comentarios.push(await this.comentarioService.create(comentario));
//     }
//     return comentarios;
//   }

//   async loadCuestionarios() {
//     const cuestionarios = [];
//     for (const cuestionario of SEED_CUESTIONARIO) {
//       cuestionarios.push(await this.cuestionarioService.create(cuestionario));
//     }
//     return cuestionarios;
//   }

//   // async loadCuestionarioRespuestaUsuario() {
//   //   const cuestionarioRespuestasUsuarios = [];
//   //   for (const cuestionarioRespuestaUsuario of SEED_CUESTIONARIORESPUESTAUSUARIO) {
//   //     cuestionarioRespuestasUsuarios.push(
//   //       await this.cuestionarioRespuestaUsuarioService.create(cuestionarioRespuestaUsuario),
//   //     );
//   //   }
//   //   return cuestionarioRespuestasUsuarios;
//   // }
// }
