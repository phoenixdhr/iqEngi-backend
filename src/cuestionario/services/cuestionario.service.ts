import { Injectable, NotFoundException } from '@nestjs/common';
import { Cuestionario } from '../entities/cuestionario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCuestionarioDto,
  UpdateCuestionarioDto,
} from '../dtos/cuestionario.dto';

@Injectable()
export class CuestionarioService {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>,
  ) {}

  findAll() {
    return this.cuestionarioModel.find().exec();
  }

  async findOne(id: string) {
    const cuestionario = await this.cuestionarioModel.findById(id).exec();

    if (!cuestionario) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id}`,
      );
    }
    return cuestionario;
  }

  async create(data: CreateCuestionarioDto) {
    const newCuestionario = new this.cuestionarioModel(data);
    await newCuestionario.save();
    return newCuestionario;
  }

  async update(id: string, changes: UpdateCuestionarioDto) {
    const updateCuestionario = await this.cuestionarioModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!updateCuestionario) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id} para actualizar`,
      );
    }

    return updateCuestionario;
  }

  async delete(id: string) {
    const cuestionarioEliminado = await this.cuestionarioModel
      .findByIdAndDelete(id)
      .exec();

    if (!cuestionarioEliminado) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id} para eliminar`,
      );
    }

    return cuestionarioEliminado;
  }

  async filterByCursoId(cursoId: string) {
    const cuestionarios = await this.cuestionarioModel
      .find({ curso: cursoId })
      .exec();

    if (!cuestionarios) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario para el curso con el id ${cursoId}`,
      );
    }

    return cuestionarios;
  }
}
