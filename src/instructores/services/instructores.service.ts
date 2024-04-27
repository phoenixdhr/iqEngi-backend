import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Instructores } from '../entities/instructores.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateInstructorDto,
  FilterInstructorDto,
  UpdateInstructorDto,
} from '../dtos/instructores.dto';

@Injectable()
export class InstructoresService {
  constructor(
    @InjectModel(Instructores.name)
    private instructorModel: Model<Instructores>,
  ) {}

  async findAll(params?: FilterInstructorDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.instructorModel.find().skip(offset).limit(limit).exec();
    }
    return await this.instructorModel.find().exec();
  }

  async findOne(id: string) {
    const instructor = await this.instructorModel.findById(id).exec();

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id}`,
      );
    }
    return instructor;
  }

  async create(data: CreateInstructorDto) {
    try {
      const newInstructor = await this.instructorModel.create(data);
      return newInstructor;
    } catch (error) {
      // Aquí podrías manejar errores específicos o lanzar una excepción personalizada
      // throw new Error('Error al crear el instructor: ' + error.message);
      throw new InternalServerErrorException(
        'Error al crear el instructor: ' + error.message,
      );
    }
  }

  async update(id: string, changes: UpdateInstructorDto) {
    const instructor = await this.instructorModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id} para actualizar`,
      );
    }

    return instructor;
  }

  async delete(id: string) {
    const instructorEliminado = await this.instructorModel
      .findByIdAndDelete(id)
      .exec();

    if (!instructorEliminado) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id} para eliminar`,
      );
    }

    return instructorEliminado; // Retorna el documento eliminado
  }
}
