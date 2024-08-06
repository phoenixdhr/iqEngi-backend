import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => CuestionarioService))
    private readonly cuestionarioService: CuestionarioService,
    @InjectModel(UnidadEducativa.name)
    private readonly unidadEducativaModel: Model<UnidadEducativa>,
    private readonly estructuraProgramariaService: EstructuraProgramariaService,
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

  //#region updateUnidadEducativa
  async updateUnidadEducativa(
    unidadEducativaId: string,
    changes: UpdateUnidadEducativaDto,
  ) {
    // Actualizar el DOCUMENTO independiente UnidadEducativa
    const unidadEducativa = await this.unidadEducativaModel
      .findByIdAndUpdate(unidadEducativaId, { $set: changes }, { new: true })
      .exec();

    if (!unidadEducativa) {
      throw new NotFoundException(
        `No se encontró ninguna unidad educativa con ID ${unidadEducativaId} para actualizar`,
      );
    }

    const estructuraProgramariaId =
      unidadEducativa.idEstructuraProgramaria.toString();

    // Obtener la estructura programaria para actualizar el subdocumento
    const estructuraProgramaria =
      await this.estructuraProgramariaService.findOne(estructuraProgramariaId);
    if (!estructuraProgramaria) {
      throw new NotFoundException(
        `No se encontró ninguna estructura programaria con ID ${estructuraProgramariaId}`,
      );
    }

    // Encontrar y actualizar el SUBDOCUMENTO
    const subUnidad = estructuraProgramaria.unidades.id(unidadEducativaId);
    if (!subUnidad) {
      throw new NotFoundException(
        `No se encontró ninguna unidad educativa con ID ${unidadEducativaId} en la estructura programaria`,
      );
    }

    subUnidad.set(changes);
    await estructuraProgramaria.save();

    return unidadEducativa;
  }

  //#region removeUnidadEducativa
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
      unidadEducativaId,
      'temas',
      temas,
    );
  }

  //#region Cuestionario Add
  async addCuestionarioId(
    unidadEducativaId: string,
    data: CreateCuestionarioDto,
  ) {
    const unidadEducativa = await this.findUnidadEducativa(unidadEducativaId);
    if (unidadEducativa.idCuestionario) {
      throw new Error(
        `La unidad educativa ya tiene un cuestionario asignado con id ${unidadEducativa.idCuestionario}`,
      );
    }

    const idEstructuraProgramaria =
      unidadEducativa.idEstructuraProgramaria.toString();

    const estructuraProgramaria =
      await this.estructuraProgramariaService.findOne(idEstructuraProgramaria);
    if (!estructuraProgramaria) {
      throw new NotFoundException(
        `no se encontro ninguna estructura programaria con id ${idEstructuraProgramaria}`,
      );
    }

    const dataCuestionario = { ...data, unidadEducativaId: unidadEducativaId };

    const cuestionario =
      await this.cuestionarioService.create(dataCuestionario);

    await cuestionario.save();

    const idCuestionario = cuestionario._id.toString();

    const subUnidad = estructuraProgramaria.unidades.id(unidadEducativaId);
    if (!subUnidad) {
      throw new NotFoundException(
        `No se encontró ninguna unidad educativa con id ${unidadEducativaId}`,
      );
    }

    subUnidad.set({ idCuestionario });
    await estructuraProgramaria.save();

    unidadEducativa.idCuestionario = idCuestionario;
    await unidadEducativa.save();

    return unidadEducativa.populate('idCuestionario');
  }

  //#region Cuestionario Remove
  async removeTemaFromUnidadEducativa(
    unidadEducativaId: string,
    temaId: string,
  ) {
    this.utils.pullFromArray(
      this.unidadEducativaModel,
      unidadEducativaId,
      'temas',
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

  //#region Filter
  async filterdByIdCuestionario(idCuestionario: string) {
    const unidadEducativa = await this.unidadEducativaModel
      .findOne({ idCuestionario })
      .exec();
    return unidadEducativa;
  }
}
