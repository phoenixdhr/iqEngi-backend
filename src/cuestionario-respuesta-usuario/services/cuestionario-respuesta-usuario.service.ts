import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CuestionarioRespuestaUsuario,
  RespuestaUsuario,
} from '../entities/cuestionario-respuesta-usuario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCuestionarioRespuestaUsuarioDto,
  CreateRespuestaUsuarioDTO,
  UpdateCuestionarioRespuestaUsuarioDto,
} from '../dtos/cuestionario-respuesta-usuario.dto';

@Injectable()
export class CuestionarioRespuestaUsuarioService {
  constructor(
    @InjectModel(CuestionarioRespuestaUsuario.name)
    private readonly cuestionarioRespuestaUsuarioModel: Model<CuestionarioRespuestaUsuario>,

    @InjectModel(RespuestaUsuario.name)
    private readonly respuestaUsuarioModel: Model<RespuestaUsuario>,
  ) {}

  findAll() {
    return this.cuestionarioRespuestaUsuarioModel.find().exec();
  }

  async findOne(cRespuestaUsuId: string) {
    const respuesta = await this.cuestionarioRespuestaUsuarioModel
      .findById(cRespuestaUsuId)
      .exec();

    if (!respuesta) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${cRespuestaUsuId}`,
      );
    }

    return respuesta;
  }

  async create(data: CreateCuestionarioRespuestaUsuarioDto) {
    const newRespuesta = new this.cuestionarioRespuestaUsuarioModel(data);
    await newRespuesta.save();
    return newRespuesta;
  }

  async update(
    cRespuestaUsuId: string,
    changes: UpdateCuestionarioRespuestaUsuarioDto,
  ) {
    const updateRespuesta = await this.cuestionarioRespuestaUsuarioModel
      .findByIdAndUpdate(cRespuestaUsuId, { $set: changes }, { new: true })
      .exec();

    if (!updateRespuesta) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${cRespuestaUsuId} para actualizar`,
      );
    }

    return updateRespuesta;
  }

  async delete(cRespuestaUsuId: string) {
    const respuestaEliminada = await this.cuestionarioRespuestaUsuarioModel
      .findByIdAndDelete(cRespuestaUsuId)
      .exec();
    if (!respuestaEliminada) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${cRespuestaUsuId} para eliminar`,
      );
    }
    return respuestaEliminada;
  }

  // #region Add My Respuesta
  async addMyRespuesta(data: CreateRespuestaUsuarioDTO) {
    const newRespuesta = new this.respuestaUsuarioModel(data);

    await newRespuesta.save();
    return newRespuesta;
  }

  // #region Filter
  async filterByUsuarioId(usuarioId: string) {
    const respuestas = await this.cuestionarioRespuestaUsuarioModel
      .find({ usuario: usuarioId })
      .exec();

    return respuestas;
  }
  async filterByCursoId(cursoId: string) {
    const respuestas = await this.cuestionarioRespuestaUsuarioModel
      .find({ curso: cursoId })
      .exec();

    if (!respuestas) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${cursoId}`,
      );
    }

    return respuestas;
  }

  async filterBy_UsuarioId_CursoId(usuarioId: string, cursoId: string) {
    const respuestas = await this.cuestionarioRespuestaUsuarioModel
      .find({ usuario: usuarioId, curso: cursoId })
      .exec();

    return respuestas;
  }

  async findBy_UsuarioId_CuestionarioId(
    usuarioId: string,
    cuestionarioId: string,
  ) {
    const cuestionarioRespuestas = await this.cuestionarioRespuestaUsuarioModel
      .findOne({ usuarioId, cuestionarioId })
      .exec();

    return cuestionarioRespuestas;
  }

  async filterByCuestionarioId(cuestionarioId: string) {
    const respuestas = await this.cuestionarioRespuestaUsuarioModel
      .find({ cuestionario: cuestionarioId })
      .exec();

    if (!respuestas) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${cuestionarioId}`,
      );
    }

    return respuestas;
  }
}
