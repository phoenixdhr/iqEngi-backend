import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CursoComprado, Perfil, Usuario } from '../entities/usuario.entity';

import { OrdenService } from '../../orden/services/orden.service';
import { ComentarioService } from 'src/comentario/services/comentario.service';
import { CuestionarioRespuestaUsuarioService } from 'src/cuestionario-respuesta-usuario/services/cuestionario-respuesta-usuario.service';
import { ProgresoCursoService } from 'src/progreso-curso/services/progreso-curso.service';
import { CursoService } from 'src/curso/services/curso.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddCuestionarioDto,
  CreateCursoCompradoDto,
  CreatePerfilDto,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from '../dtos/usuario.dto';
import { MongooseUtilsService } from 'src/_mongoose-utils-service/services/_mongoose-utils-service.service';
import { ObjectId } from 'mongodb';
import { CuestionarioService } from 'src/cuestionario/services/cuestionario.service';
import {
  EstructuraProgramaria,
  // UnidadEducativa,
} from 'src/estructura-programaria/entities/estructura-programaria.entity';
import { UnidadEducativaService } from 'src/estructura-programaria/services/unidad-educativa.service';
import { ArrayCursosId } from 'src/orden/dtos/orden.dto';
import { CreateComentariosDto } from 'src/comentario/dtos/comentario.dto';
import { ProgresoCurso } from 'src/progreso-curso/entities/progreso-curso.entity';
import { CreateRespuestaUsuarioDTO } from 'src/cuestionario-respuesta-usuario/dtos/cuestionario-respuesta-usuario.dto';
import { RolesEnumGql } from '../dtos/args-gql/rolesEnumGql';
import { PaginationArgs } from 'src/_common/dtos/pagination.args';
import { SearchArgs } from 'src/_common/dtos';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(forwardRef(() => CursoService))
    private readonly cursoService: CursoService,
    private readonly ordenesService: OrdenService,
    private readonly comentariosService: ComentarioService,
    private readonly progresoCursosService: ProgresoCursoService,
    private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
    private readonly cuestionarioService: CuestionarioService,
    private readonly unidadEducativaService: UnidadEducativaService,

    @InjectModel(Usuario.name) private readonly usuariosModel: Model<Usuario>,
    @InjectModel(Perfil.name) private readonly perfilesModel: Model<Perfil>,
    @InjectModel(CursoComprado.name)
    private readonly cursoCompradoModel: Model<CursoComprado>,

    private readonly utils: MongooseUtilsService,
  ) {}

  // #region CRUD service
  async findAll(
    pagination?: PaginationArgs,
    searchInput?: SearchArgs,
  ): Promise<Usuario[]> {
    const { limit, offset } = pagination;
    const { search } = searchInput;
    // Si existe un valor de búsqueda, filtra por el campo 'firstName'
    if (search) {
      return this.usuariosModel
        .find({ firstName: { $regex: search, $options: 'i' } }) // $regex para coincidencias parciales, $options: 'i' para búsqueda insensible a mayúsculas/minúsculas
        .skip(offset)
        .limit(limit)
        .exec();
    }
    return this.usuariosModel.find().skip(offset).limit(limit).exec();
  }

  async findUsersByRol(rolesEnumGql: RolesEnumGql): Promise<Usuario[]> {
    // return this.usuariosModel.find({ rol: { $in: rolesEnumGql.roles } }).exec();
    return this.usuariosModel
      .find({ roles: { $in: rolesEnumGql.roles } })
      .exec();
  }

  // async findAllRoles(roles: RolEnum[]): Promise<Usuario[]> {
  //   return this.usuariosModel.find({ rol: { $in: roles } }).exec();
  // }

  async findOne(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuariosModel.findById(usuarioId).exec();
    console.log('usuario makoooo', usuario);

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    return usuario;
  }

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    const { password, ...rest } = data;
    const hash = await bcrypt.hash(password, 10);

    const newUsuario = new this.usuariosModel({
      ...rest,
      hashPassword: hash,
    });
    const respNewUsario = await newUsuario.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, ...NewUsarioWPass } = respNewUsario.toJSON();
    return NewUsarioWPass;
  }

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuariosModel.findOne({ email }).exec();
    return usuario;
  }

  async update(usuarioId: string, changes: UpdateUsuarioDto): Promise<Usuario> {
    const updateUsuario = await this.usuariosModel
      .findByIdAndUpdate(usuarioId, { $set: changes }, { new: true })
      .exec();

    if (!updateUsuario) {
      throw new NotFoundException(
        `Usuario con ID ${usuarioId} no encontrado para actualizar`,
      );
    }

    return updateUsuario;
  }

  async delete(usuarioId: string): Promise<Usuario> {
    const usuarioEliminado = await this.usuariosModel
      .findByIdAndDelete(usuarioId)
      .exec();

    if (!usuarioEliminado) {
      throw new NotFoundException(
        `Usuario con ID ${usuarioId} no encontrado para eliminar`,
      );
    }

    return usuarioEliminado;
  }

  // #region Add CursoComprado
  async addCursoComprado(
    usuarioId: string,
    cursoCompradoDoc: CreateCursoCompradoDto,
  ): Promise<Usuario> {
    const usuario = await this.usuariosModel.findById(usuarioId).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const cursoId = cursoCompradoDoc.cursoId;
    const curso = await this.cursoService.findOne(cursoId);
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado`);
    }

    const newProgresoCurso: ProgresoCurso =
      await this.progresoCursosService.createProgresoCurso(usuarioId, cursoId);
    const progresoCursoId = newProgresoCurso._id;

    const dataToCursoComprado = { ...cursoCompradoDoc, progresoCursoId };
    const newCursoComprado = new this.cursoCompradoModel(dataToCursoComprado);
    await newCursoComprado.save();

    usuario.cursos_comprados.push(newCursoComprado);
    await usuario.save();

    return usuario;
  }

  // async addProgresoCurso(usuarioId: string, progresoCursoId) {
  //   const usuario = await this.findOne(usuarioId) as Usuario;

  //   usuario.cursos_comprados.

  //   this.utils.pushToArray(
  //     this.usuariosModel,
  //     usuarioId,
  //     'cursos_comprados_historial',
  //     progresoCursoId,
  //   ]);
  // }

  // #region Add Cuestionario-Respuesta
  async addCuestionarioRespuestaToProgesoCurso(
    usuarioId: string,
    data: AddCuestionarioDto,
  ) {
    // Buscar usuario por ID
    const usuario = await this.usuariosModel.findById(usuarioId).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const { cursoId, idEstructuraProgramaria, unidadEducativaId } = data;

    // Buscar curso por ID
    const curso = await this.cursoService.findOne(cursoId);
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado`);
    }

    // Poblar la estructura programaria del curso
    const cursoCompleto = await curso.populate('estructuraProgramaria');

    const arrayEstructuraProgramaria =
      cursoCompleto.estructuraProgramaria as Types.DocumentArray<EstructuraProgramaria>;

    const estructuraProgramaria = arrayEstructuraProgramaria.find((ep) => {
      return ep._id.toString() === idEstructuraProgramaria.toString();
    });

    if (!estructuraProgramaria) {
      throw new NotFoundException(
        `Estructura Programaria con ID ${idEstructuraProgramaria} no encontrada en el curso ${cursoId}`,
      );
    }

    // Encontrar la unidad educativa específica dentro de la estructura programaria
    const arrayUnidades = estructuraProgramaria.unidades;

    const subUnidad = arrayUnidades.find((u) => {
      return u._id.toString() === unidadEducativaId.toString();
    });

    if (!subUnidad) {
      throw new NotFoundException(
        `Unidad Educativa con ID ${unidadEducativaId} no encontrada en la estructura programaria ${idEstructuraProgramaria} del curso ${cursoId}`,
      );
    }

    const cuestionarioId = subUnidad.idCuestionario.toString();

    // Crear Cuestionario-Respuesta-Usuario
    const dataCreate = {
      usuarioId,
      cursoId,
      unidadEducativaId,
      cuestionarioId,
    };

    const cuestionarioRespuestaUsuario =
      await this.cuestionarioRespuestaUsuarioService.create(dataCreate);

    const progresoCurso =
      await this.progresoCursosService.filterByUsuarioCursoId(
        usuarioId,
        cursoId,
      );

    if (!progresoCurso) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el usuario ${usuarioId} y curso ${cursoId}`,
      );
    }

    progresoCurso.cuestionariosRespuestaUsuarioId.push(
      cuestionarioRespuestaUsuario._id,
    );
    progresoCurso.save();

    return {
      progresoCurso: progresoCurso,
      cuestionarioRespuestaUsuario: cuestionarioRespuestaUsuario,
    };
  }

  // #region Add Respuesta
  async addRespuesta(
    usuarioId: string,
    cuestionarioId: string,
    data: CreateRespuestaUsuarioDTO,
  ) {
    await this.findOne(usuarioId);

    const cuestionarioRespuestas =
      await this.cuestionarioRespuestaUsuarioService.findBy_UsuarioId_CuestionarioId(
        usuarioId,
        cuestionarioId,
      );

    if (!cuestionarioRespuestas) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene acceso al cuestionario con ID ${cuestionarioId}`,
      );
    }

    cuestionarioRespuestas.respuestas.push(data);
    await cuestionarioRespuestas.save();
    return cuestionarioRespuestas.respuestas;
  }

  // #region Create Orden
  async createOrden(usuarioId: string, arrayCursos: ArrayCursosId) {
    await this.findOne(usuarioId);

    const { cursos } = arrayCursos;
    const data = { usuarioId, cursos: cursos };
    const newOrden = await this.ordenesService.create(data);
    return newOrden;
  }

  // #region Create Comentario
  async createComentario(
    usuarioId: string,
    cursoId: string,
    data: CreateComentariosDto,
  ) {
    this.findOne(usuarioId);
    await this.cursoService.findOne(cursoId);

    const newdata = { ...data, usuarioId, cursoId };

    const newComentario = await this.comentariosService.create(newdata);
    return newComentario;
  }

  // #region add
  async addInteres(usuarioId: string, interes: string[]) {
    const usuario = await this.findOne(usuarioId);
    const perfilId = usuario.perfil._id;
    this.utils.pushToArray(this.perfilesModel, perfilId, 'intereses', interes);
  }

  // #region remove
  async removeInteres(usuarioId: string, interes: string) {
    const usuario = await this.findOne(usuarioId);
    const perfilId = usuario.perfil._id;

    this.utils.pullFromArray(
      this.perfilesModel,
      'intereses',
      perfilId,
      interes,
    );
  }

  async removeCursoComprado(usuarioId: string, cursoCompradoId: string) {
    this.utils.pullFromArray(
      this.usuariosModel,
      usuarioId,
      'cursos_comprados',
      cursoCompradoId,
    );
  }

  // async removeProgresoCurso(usuarioId: string, progresoCursoId: string) {
  //   this.utils.pullFromArray(
  //     this.usuariosModel,
  //     usuarioId,
  //     'progreso_cursos',
  //     progresoCursoId,
  //   );
  // }

  // #region Update
  async updatePerfil(usuarioId: string, perfil: CreatePerfilDto) {
    try {
      const usuario = await this.usuariosModel
        .findByIdAndUpdate(usuarioId, { $set: perfil }, { new: true })
        .exec();

      if (!usuario) {
        throw new NotFoundException(
          `Usuario con ID ${usuarioId} no encontrado para actualizar Perfil`,
        );
      }
      return usuario;
    } catch (error) {
      throw error;
    }
  }

  // #region Find
  async findCursosComprados(usuarioId: string) {
    const usuario = await this.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene cursos comprados`,
      );
    }

    const cursosComprados = usuario.cursos_comprados;
    return cursosComprados;
  }

  async findProgresoCursosByUsuaioIdCursoId(
    usuarioId: string,
    cursoId: string,
  ) {
    const progresoCurso =
      await this.progresoCursosService.filterByUsuarioCursoId(
        usuarioId,
        cursoId,
      );
    return progresoCurso;
  }

  // #region Find import Service
  async findOrdenes(usuarioId: string) {
    const ordenes = this.ordenesService.filterByUsuarioId(usuarioId);

    if (!ordenes) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene ordenes`,
      );
    }
    return ordenes;
  }

  async findComentarios(usuarioId: string) {
    const comentarios = this.comentariosService.filterByUserId(usuarioId);

    if (!comentarios) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene comentarios`,
      );
    }
    return comentarios;
  }

  // #region Find en otros servicios
  async findAllCuestionariosRespondidos(usuarioId: string) {
    const cuestionariosRespondidos =
      await this.cuestionarioRespuestaUsuarioService.filterByUsuarioId(
        usuarioId,
      );

    if (!cuestionariosRespondidos) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene ningun cuestionario respondido`,
      );
    }

    return cuestionariosRespondidos;
  }

  async findCuestionarioRespondido_UsuarioId_CursoId(
    usuarioId: string,
    cursoId: string,
  ) {
    const cuestionariosRespuesta_Usuario_Curso =
      await this.cuestionarioRespuestaUsuarioService.filterBy_UsuarioId_CursoId(
        usuarioId,
        cursoId,
      );

    if (!cuestionariosRespuesta_Usuario_Curso) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no ha respondido ninguna evaluacion del curso con ID ${cursoId}`,
      );
    }
    return cuestionariosRespuesta_Usuario_Curso;
  }

  // #region Filter
  async filterByCursoId(cursoId: string) {
    const allUsuarios = await this.findAll();
    const usuariosXcurso = allUsuarios.filter((usuario) =>
      usuario.cursos_comprados.some(
        (curso) => curso.cursoId === new ObjectId(cursoId),
      ),
    );

    if (!usuariosXcurso) {
      throw new NotFoundException(
        `No se encontró ningún estudiante que haya comprado el curso con id ${cursoId}`,
      );
    }

    return usuariosXcurso;
  }
}
