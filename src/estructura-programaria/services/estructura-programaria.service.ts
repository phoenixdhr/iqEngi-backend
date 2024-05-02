import { Injectable, NotFoundException } from '@nestjs/common';
import { EstructuraProgramaria } from '../entities/estructura-programaria.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EstructuraProgramariaService {
  constructor(
    @InjectModel(EstructuraProgramaria.name)
    private readonly estructuraProgramariaModel: Model<EstructuraProgramaria>,
  ) {}

  findAll() {
    return this.estructuraProgramariaModel.find().exec();
  }

  async findOne(id: string) {
    const estructuraProgramaria = await this.estructuraProgramariaModel
      .findById(id)
      .exec();

    if (!estructuraProgramaria) {
      throw new NotFoundException(
        `no se encontro ninguna estructura programaria con id ${id}`,
      );
    }
    return this.estructuraProgramariaModel.findById(id).exec();
  }

  async create(data: any) {
    const newEstructuraProgramaria = new this.estructuraProgramariaModel(data);
    await newEstructuraProgramaria.save();
    return newEstructuraProgramaria;
  }

  async update(id: string, changes: any) {
    const updateEstructuraProgramaria = await this.estructuraProgramariaModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!updateEstructuraProgramaria) {
      throw new NotFoundException(
        `no se encontro ninguna estructura programaria con id ${id} para actualizar`,
      );
    }

    return updateEstructuraProgramaria;
  }

  async delete(id: string) {
    const estructuraProgramariaEliminada = await this.estructuraProgramariaModel
      .findByIdAndDelete(id)
      .exec();

    if (!estructuraProgramariaEliminada) {
      throw new NotFoundException(
        `no se encontro ninguna estructura programaria con id ${id} para eliminar`,
      );
    }

    return estructuraProgramariaEliminada;
  }
}
