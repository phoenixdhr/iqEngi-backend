import { Injectable, NotFoundException } from '@nestjs/common';
import { UnidadEducativa } from '../entities/estructura-programaria.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUnidadEducativaDto,
  UpdateUnidadEducativaDto,
} from '../dtos/estructura-Programaria.dto';
import { EstructuraProgramariaService } from './estructura-programaria.service';
import { MongooseUtilsService } from 'src/_mongoose-utils-service/services/_mongoose-utils-service.service';
import { CuestionarioService } from 'src/cuestionario/services/cuestionario.service';
import { CreateCuestionarioDto } from 'src/cuestionario/dtos/cuestionario.dto';

@Injectable()
export class UnidadEducativaService {
  constructor(
    @InjectModel(UnidadEducativa.name)
    private readonly unidadEducativaModel: Model<UnidadEducativa>,
    private readonly estructuraProgramariaService: EstructuraProgramariaService,
    private readonly cuestionarioService: CuestionarioService,
    private readonly utils: MongooseUtilsService,
  ) {}

  //#region find Schema
  async findAllUnidadEducativa() {
    const unidadEducativa = await this.unidadEducativaModel.find().exec();
    return unidadEducativa;
  }

  async findUnidadEducativa(unidadEducativaId: string) {
    const unidadEducativa = await this.unidadEducativaModel
      .findById(unidadEducativaId)
      .exec();
    if (!unidadEducativa) {
      throw new NotFoundException(
        `no se encontro ninguna unidad educativa con id ${unidadEducativaId}`,
      );
    }
    return unidadEducativa;
  }

  //#region add Schema
  async addUnidadEducativa(
    idEstructuraProgramaria: string,
    unidadEducativa: CreateUnidadEducativaDto,
  ) {
    const estructuraProgramaria =
      await this.estructuraProgramariaService.findOne(idEstructuraProgramaria);
    console.log(estructuraProgramaria);

    const data = {
      ...unidadEducativa,
      idEstructuraProgramaria,
    };

    const newUnidadEducativa = new this.unidadEducativaModel(data);
    await newUnidadEducativa.save();

    estructuraProgramaria.unidades.push(newUnidadEducativa);
    await estructuraProgramaria.save();

    return estructuraProgramaria;
  }

  //#region Update Schema
  async updateUnidadEducativa(
    unidadEducativaId: string,
    changes: UpdateUnidadEducativaDto,
  ) {
    const unidadEducativa = await this.unidadEducativaModel
      .findByIdAndUpdate(unidadEducativaId, { $set: changes }, { new: true })
      .exec();

    if (!unidadEducativa) {
      throw new NotFoundException(
        `no se encontro ninguna unidad educativa con id ${unidadEducativaId} para actualizar`,
      );
    }

    return unidadEducativa;
  }

  //#region Remove Schema
  async removeUnidadEducativa(unidadEducativaId: string) {
    const unidadEducativa = await this.unidadEducativaModel
      .findByIdAndDelete(unidadEducativaId)
      .exec();

    if (!unidadEducativa) {
      throw new NotFoundException(
        `no se encontro ninguna unidad educativa con id ${unidadEducativaId}`,
      );
    }

    const estructuraProgramariaId =
      unidadEducativa.idEstructuraProgramaria.toString();
    const estructuraProgramaria =
      await this.estructuraProgramariaService.findOne(estructuraProgramariaId);

    estructuraProgramaria.unidades.pull(unidadEducativa);
    await estructuraProgramaria.save();

    return estructuraProgramaria;
  }

  //#region Add
  async addTemaToUnidadEducativa(unidadEducativaId: string, temas: string[]) {
    this.utils.pushToArray(
      this.unidadEducativaModel,
      'temas',
      unidadEducativaId,
      temas,
    );
  }

  //#region Cuestionario Add
  async addCuestionarioId(
    unidadEducativaId: string,
    data: CreateCuestionarioDto,
  ) {
    const unidadEducativa = await this.findUnidadEducativa(unidadEducativaId);
    const dataCuestionario = { ...data, unidadEducativaId: unidadEducativaId };

    const cuestionario =
      await this.cuestionarioService.create(dataCuestionario);

    await cuestionario.save();

    unidadEducativa.idCuestionario = cuestionario._id;
    unidadEducativa.save();
    return unidadEducativa.populate('idCuestionario');
  }

  //#region Cuestionario Remove
  async removeTemaFromUnidadEducativa(
    unidadEducativaId: string,
    temaId: string,
  ) {
    this.utils.pullFromArray(
      this.unidadEducativaModel,
      'temas',
      unidadEducativaId,
      temaId,
    );
  }

  async removeCuestionarioId(cuestionarioId: string) {
    const cuestionario = await this.cuestionarioService.findOne(cuestionarioId);
    const unidadEducativaId = await cuestionario.unidadEducativaId.toString();

    const unidadEducativa = await this.findUnidadEducativa(unidadEducativaId);

    unidadEducativa.idCuestionario = null;
    return unidadEducativa.save();
  }
}
