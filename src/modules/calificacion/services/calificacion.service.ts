// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Calificacion } from '../entities/calificacion.entity';
// import { CreateCalificacionInput } from '../dtos/create-calificacion.input';

// @Injectable()
// export class CalificacionService {
//   constructor(
//     @InjectModel(Calificacion.name)
//     private readonly calificacionModel: Model<Calificacion>,
//   ) {}

//   async create(calificacion: CreateCalificacionInput): Promise<Calificacion> {
//     const newCalificacion = new this.calificacionModel(calificacion);
//     return newCalificacion.save();
//   }

//   async findAll(): Promise<Calificacion[]> {
//     return this.calificacionModel.find().exec();
//   }

//   async findOneById(id: string): Promise<Calificacion> {
//     return this.calificacionModel.findById(id).exec();
//   }
// }

// calificacion.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionInput } from '../dtos/create-calificacion.input';
import { UpdateCalificacionInput } from '../dtos/update-calificacion.input';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectModel(Calificacion.name)
    private readonly calificacionModel: Model<Calificacion>,
  ) {}

  /**
   * Crea una nueva calificación.
   * @param createCalificacionInput Datos para crear la calificación.
   * @returns La calificación creada.
   */
  async create(
    createCalificacionInput: CreateCalificacionInput,
  ): Promise<Calificacion> {
    const newCalificacion = new this.calificacionModel(createCalificacionInput);
    try {
      return await newCalificacion.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear la calificación',
        error.message,
      );
    }
  }

  /**
   * Obtiene todas las calificaciones.
   * @returns Un array de calificaciones.
   */
  async findAll(): Promise<Calificacion[]> {
    return this.calificacionModel.find().exec();
  }

  /**
   * Obtiene una calificación por su ID.
   * @param id ID de la calificación.
   * @returns La calificación encontrada.
   * @throws NotFoundException si la calificación no existe.
   */
  async findOneById(id: string): Promise<Calificacion> {
    const calificacion = await this.calificacionModel.findById(id).exec();
    if (!calificacion) {
      throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
    }
    return calificacion;
  }

  /**
   * Obtiene calificaciones por curso ID.
   * @param cursoId ID del curso.
   * @returns Un array de calificaciones del curso.
   */
  async findByCursoId(cursoId: string): Promise<Calificacion[]> {
    return this.calificacionModel.find({ cursoId }).exec();
  }

  /**
   * Obtiene calificaciones por usuario ID.
   * @param usuarioId ID del usuario.
   * @returns Un array de calificaciones del usuario.
   */
  async findByUsuarioId(usuarioId: string): Promise<Calificacion[]> {
    return this.calificacionModel.find({ usuarioId }).exec();
  }

  /**
   * Actualiza una calificación por su ID.
   * @param id ID de la calificación a actualizar.
   * @param updateCalificacionInput Datos para actualizar la calificación.
   * @returns La calificación actualizada.
   * @throws NotFoundException si la calificación no existe.
   */
  async update(
    id: string,
    updateCalificacionInput: UpdateCalificacionInput,
  ): Promise<Calificacion> {
    const updatedCalificacion = await this.calificacionModel
      .findByIdAndUpdate(id, updateCalificacionInput, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCalificacion) {
      throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
    }

    return updatedCalificacion;
  }

  /**
   * Elimina una calificación por su ID.
   * @param id ID de la calificación a eliminar.
   * @returns La calificación eliminada.
   * @throws NotFoundException si la calificación no existe.
   */
  async remove(id: string): Promise<Calificacion> {
    const deletedCalificacion = await this.calificacionModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCalificacion) {
      throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
    }
    return deletedCalificacion;
  }

  /**
   * Calcula el promedio de calificaciones de un curso.
   * @param cursoId ID del curso.
   * @returns El promedio de calificaciones.
   */
  async calculatePromedio(cursoId: string): Promise<number> {
    const calificaciones = await this.findByCursoId(cursoId);
    if (calificaciones.length === 0) {
      return 0;
    }
    const sum = calificaciones.reduce(
      (acc, calificacion) => acc + calificacion.valor,
      0,
    );
    return sum / calificaciones.length;
  }
}
