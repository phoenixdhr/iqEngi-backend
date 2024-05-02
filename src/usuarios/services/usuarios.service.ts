import { Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';

import { OrdenesService } from '../../ordenes/services/ordenes.service';
import { ComentariosService } from 'src/comentarios/services/comentarios.service';
import { CuestionarioRespuestaUsuarioService } from 'src/cuestionario-respuesta-usuario/services/cuestionario-respuesta-usuario.service';
import { ProgresoCursosService } from 'src/progreso-cursos/services/progreso-cursos.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dtos/usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly comentariosService: ComentariosService,
    private readonly progresoCursosService: ProgresoCursosService,
    private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
    @InjectModel(Usuario.name) private readonly usuariosModel: Model<Usuario>,
  ) {}

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

  async findCursosComprados(usuarioId: string) {
    const usuario = await this.findOne(usuarioId);
    const cursosComprados = usuario.cursos_comprados_historial || [];
    return cursosComprados;
  }

  async findProgresoCursos(usuarioId: string) {
    const usuario = await this.findOne(usuarioId);
    const progresoCursos = usuario.curso_progreso || [];
    return progresoCursos;
  }

  async findOrdenes(usuarioId: string) {
    const ordenes = this.ordenesService.filterByUsuarioId(usuarioId);

    if (!ordenes) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no tiene ordenes registradas`,
      );
    }
    return ordenes;
  }

  async findComentarios(usuarioId: string) {
    const comentarios = this.comentariosService.filterByUserId(usuarioId);

    if (!comentarios) {
      throw new NotFoundException(
        `Comentarios para el usuario con ID ${usuarioId} no encontrados`,
      );
    }
    return comentarios;
  }

  async findAllCuestionariosRespondidos(usuarioId: string) {
    const cuestionariosRespuestaUsuario =
      await this.cuestionarioRespuestaUsuarioService.filterByUsuarioId(
        usuarioId,
      );

    if (!cuestionariosRespuestaUsuario) {
      throw new NotFoundException(
        `Cuestionarios no encontrados con ID ${usuarioId}`,
      );
    }

    return cuestionariosRespuestaUsuario;
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
}
