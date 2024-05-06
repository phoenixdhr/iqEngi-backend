import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EstructuraProgramaria,
  UnidadEducativa,
} from '../entities/estructura-programaria.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateEstructuraProgramariaDto,
  UpdateEstructuraProgramariaDto,
} from '../dtos/estructura-Programaria.dto';

@Injectable()
export class EstructuraProgramariaService {
  constructor(
    @InjectModel(EstructuraProgramaria.name)
    private readonly estructuraProgramariaModel: Model<EstructuraProgramaria>,
    @InjectModel(UnidadEducativa.name)
    private readonly unidadEducativaModel: Model<UnidadEducativa>,
  ) {}

  //#region CRUD service
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

  async create(data: CreateEstructuraProgramariaDto) {
    const newEstructuraProgramaria = new this.estructuraProgramariaModel(data);
    await newEstructuraProgramaria.save();
    return newEstructuraProgramaria;
  }

  async update(id: string, changes: UpdateEstructuraProgramariaDto) {
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

    const unidadesArray = estructuraProgramariaEliminada.unidades;

    unidadesArray.forEach(async (unidad) => {
      await this.unidadEducativaModel.findByIdAndDelete(unidad).exec();
    });

    if (!estructuraProgramariaEliminada) {
      throw new NotFoundException(
        `no se encontro ninguna estructura programaria con id ${id} para eliminar`,
      );
    }

    return estructuraProgramariaEliminada;
  }
}
