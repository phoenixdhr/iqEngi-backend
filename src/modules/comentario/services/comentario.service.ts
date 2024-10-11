import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario } from '../entities/comentario.entity';
import { CreateComentarioInput } from '../dtos/create-comentario.input';
import { UpdateComentarioInput } from '../dtos/update-comentario.input';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>,
  ) {}

  /**
   * Crea un nuevo comentario.
   * @param createComentarioInput Datos para crear el comentario.
   * @returns El comentario creado.
   */
  async create(
    createComentarioInput: CreateComentarioInput,
  ): Promise<Comentario> {
    const newComentario = new this.comentarioModel(createComentarioInput);
    return newComentario.save();
  }

  /**
   * Obtiene todos los comentarios.
   * @returns Un array de comentarios.
   */
  async findAll(): Promise<Comentario[]> {
    return this.comentarioModel.find().exec();
  }

  /**
   * Obtiene un comentario por su ID.
   * @param id ID del comentario.
   * @returns El comentario encontrado.
   * @throws NotFoundException si el comentario no existe.
   */
  async findById(id: string): Promise<Comentario> {
    const comentario = await this.comentarioModel.findById(id).exec();
    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    return comentario;
  }

  /**
   * Obtiene los comentarios por el ID del curso.
   * @param cursoId ID del curso.
   * @returns Un array de comentarios.
   */
  async findByCursoId(cursoId: string): Promise<Comentario[]> {
    return this.comentarioModel.find({ cursoId }).exec();
  }

  /**
   * Obtiene los comentarios por el ID del usuario.
   * @param usuarioId ID del usuario.
   * @returns Un array de comentarios.
   */
  async findByUsuarioId(usuarioId: string): Promise<Comentario[]> {
    return this.comentarioModel.find({ usuarioId }).exec();
  }

  /**
   * Actualiza un comentario por su ID.
   * @param id ID del comentario a actualizar.
   * @param updateComentarioInput Datos para actualizar el comentario.
   * @returns El comentario actualizado.
   * @throws NotFoundException si el comentario no existe.
   */
  async update(
    id: string,
    updateComentarioInput: UpdateComentarioInput,
  ): Promise<Comentario> {
    const updatedComentario = await this.comentarioModel
      .findByIdAndUpdate(id, updateComentarioInput, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedComentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    return updatedComentario;
  }

  /**
   * Elimina un comentario por su ID.
   * @param id ID del comentario a eliminar.
   * @returns El comentario eliminado.
   * @throws NotFoundException si el comentario no existe.
   */
  async remove(id: string): Promise<Comentario> {
    const deletedComentario = await this.comentarioModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedComentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    return deletedComentario;
  }
}
