import { Injectable, NotFoundException } from '@nestjs/common';
import { Perfil, Usuario } from '../entities/usuario.entity';

import { OrdenesService } from '../../ordenes/services/ordenes.service';
import { ComentariosService } from 'src/comentarios/services/comentarios.service';
import { CuestionarioRespuestaUsuarioService } from 'src/cuestionario-respuesta-usuario/services/cuestionario-respuesta-usuario.service';
import { ProgresoCursosService } from 'src/progreso-cursos/services/progreso-cursos.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCursoCompradoDto,
  CreatePerfilDto,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from '../dtos/usuarios.dto';
import { MongooseUtilsService } from 'src/_mongoose-utils-service/services/_mongoose-utils-service.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly comentariosService: ComentariosService,
    private readonly progresoCursosService: ProgresoCursosService,
    private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
    @InjectModel(Usuario.name) private readonly usuariosModel: Model<Usuario>,
    @InjectModel(Perfil.name) private readonly perfilesModel: Model<Perfil>,
    private readonly utils: MongooseUtilsService,
  ) {}

  // #region CRUD service
  findAll() {
    return this.usuariosModel.find().exec();
  }

  async findOne(usuarioId: string) {
    const usuario = this.usuariosModel.findById(usuarioId).exec();

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    return usuario;
  }

  async create(data: CreateUsuarioDto) {
    const newUsuario = await new this.usuariosModel(data);
    await newUsuario.save();
    return newUsuario;
  }

  async update(usuarioId: string, changes: UpdateUsuarioDto) {
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

  async delete(usuarioId: string) {
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

  // #region add
  async addInteres(usuarioId: string, interes: string[]) {
    const usuario = await this.findOne(usuarioId);
    const perfilId = usuario.perfil._id;
    this.utils.pushToArray(this.perfilesModel, 'intereses', perfilId, interes);
  }

  async addCursoComprado(
    usuarioId: string,
    cursoCompradoDoc: CreateCursoCompradoDto[],
  ) {
    this.utils.pushToArray(
      this.usuariosModel,
      'cursos_comprados_historial',
      usuarioId,
      cursoCompradoDoc,
    );
  }

  async addProgresoCurso(usuarioId: string, progresoCursoId: string[]) {
    this.utils.pushToArray(
      this.usuariosModel,
      'curso_progreso',
      usuarioId,
      progresoCursoId,
    );
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
      'cursos_comprados_historial',
      usuarioId,
      cursoCompradoId,
    );
  }

  async removeProgresoCurso(usuarioId: string, progresoCursoId: string) {
    this.utils.pullFromArray(
      this.usuariosModel,
      'curso_progreso',
      usuarioId,
      progresoCursoId,
    );
  }

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

    const cursosComprados = usuario.cursos_comprados_historial;
    return cursosComprados;
  }

  async findProgresoCursos(usuarioId: string) {
    const usuario = await this.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene progreso en cursos`,
      );
    }
    const progresoCursos = usuario.curso_progreso;
    return progresoCursos;
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
      usuario.cursos_comprados_historial.some(
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
