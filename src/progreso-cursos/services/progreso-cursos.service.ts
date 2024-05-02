import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgresoCurso } from '../entities/progreso-curso.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateProgresoCursoDto,
  UpdateProgresoCursoDto,
} from '../dtos/progresoCurso.dto';

@Injectable()
export class ProgresoCursosService {
  constructor(
    @InjectModel(ProgresoCurso.name)
    private readonly progresoCursoModel: Model<ProgresoCurso>,
  ) {}

  findAll() {
    return this.progresoCursoModel.find().exec();
  }

  async findOne(ProgresoCursoId: string) {
    const progresoCurso = await this.progresoCursoModel
      .findById(ProgresoCursoId)
      .exec();

    if (!progresoCurso) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el id ${ProgresoCursoId}`,
      );
    }

    return progresoCurso;
  }

  async create(data: CreateProgresoCursoDto) {
    const newProgresoCurso = new this.progresoCursoModel(data);
    await newProgresoCurso.save();
    return newProgresoCurso;
  }

  async update(ProgresoCursoId: string, changes: UpdateProgresoCursoDto) {
    const updateProgresoCurso = await this.progresoCursoModel
      .findByIdAndUpdate(ProgresoCursoId, { $set: changes }, { new: true })
      .exec();

    if (!updateProgresoCurso) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el id ${ProgresoCursoId} para actualizar`,
      );
    }

    return updateProgresoCurso;
  }

  async delete(pCursoId: string) {
    const progresoCursoEliminado = await this.progresoCursoModel
      .findByIdAndDelete(pCursoId)
      .exec();

    if (!progresoCursoEliminado) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el id ${pCursoId} para eliminar`,
      );
    }

    return progresoCursoEliminado;
  }
}
