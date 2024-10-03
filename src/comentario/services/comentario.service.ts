import { Injectable, NotFoundException } from '@nestjs/common';
import { Comentario } from '../entities/comentario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateComentariosDto } from '../dtos/comentario.dto';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>,
  ) {}

  // #region CRUD service
  async findAll() {
    const allComentarios = await this.comentarioModel.find().exec();
    return allComentarios;
  }

  async findOne(id: string) {
    const comentario = await this.comentarioModel.findById(id).exec();
    if (!comentario) {
      throw new NotFoundException(
        `No se encontró ningún comentario con el id ${id}`,
      );
    }
    return comentario;
  }

  async create(data: CreateComentariosDto) {
    const newComentario = new this.comentarioModel(data);
    await newComentario.save();
    return newComentario;
  }

  async update(id: string, changes: any) {
    const updateComentario = await this.comentarioModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!updateComentario) {
      throw new NotFoundException(
        `No se encontró ningún comentario con el id ${id} para actualizar`,
      );
    }

    return updateComentario;
  }

  async delete(id: string) {
    const comentarioEliminado = await this.comentarioModel
      .findByIdAndDelete(id)
      .exec();

    if (!comentarioEliminado) {
      throw new NotFoundException(
        `No se encontró ningún comentario con el id ${id} para eliminar`,
      );
    }

    return comentarioEliminado;
  }

  // #region Filter
  async filterByCursoId(cursoId: string) {
    const comentariosXcurso = await this.comentarioModel
      .find({ curso: cursoId })
      .exec();
    if (!comentariosXcurso) {
      throw new NotFoundException(
        `No se encontró ningún comentario para el curso con el id ${cursoId}`,
      );
    }
    return comentariosXcurso;
  }

  async filterByUserId(userId: string) {
    const comentariosxUsuario = await this.comentarioModel
      .find({ usuario: userId })
      .exec();

    if (!comentariosxUsuario) {
      throw new NotFoundException(
        `No se encontró ningún comentario para el usuario con el id ${userId}`,
      );
    }

    return comentariosxUsuario;
  }
}
