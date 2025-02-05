import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Modulo } from '../entities/modulo.entity';
import { UpdateModuloInput } from '../dtos/modulo-dtos/update-modulo.input';
import { CreateModuloInput } from '../dtos/modulo-dtos/create-modulo.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CursoService } from './curso.service';
import { UpdateCursoInput } from '../dtos/curso-dtos/update-curso.input';
import { PaginationArgs } from 'src/common/dtos';

@Injectable()
export class ModuloService extends BaseService<
  Modulo,
  UpdateModuloInput,
  CreateModuloInput
> {
  constructor(
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo Mongoose para gestionar los datos de Modulo en la base de datos.    private readonly cursoService: CursoService, // Servicio para interactuar con la entidad Curso.
    private readonly cursoService: CursoService, // Servicio para interactuar con la entidad Curso.
  ) {
    super(moduloModel); // Inicialización del servicio base con el modelo Modulo.
  }

  async _create(
    createModuloInput: CreateModuloInput,
    userid: Types.ObjectId,
  ): Promise<Modulo> {
    // Verifica si ya existe el curso proporcionado.

    const cursoId = new Types.ObjectId(createModuloInput.cursoIdString);

    // 🔹 Verifica si ya existe un módulo con el mismo cursoId y numeroModulo
    const existingModulo = await this.moduloModel.findOne({
      cursoId,
      numeroModulo: createModuloInput.numeroModulo,
    });

    if (existingModulo) {
      throw new NotFoundException(
        `Ya existe un módulo con numeroModulo: ${createModuloInput.numeroModulo} en el cursoId: ${cursoId}`,
      );
    }

    const curso = await this.cursoService.findById(cursoId);

    // Crea un nuevo cuestionario utilizando el método del servicio base.
    const newModel = await super.create(
      { ...createModuloInput, cursoId },
      userid,
    );

    // Actualiza el curso relacionado para establecer la referencia al nuevo cuestionario.
    const dtoUpdateCurso = {
      modulosIds: [...curso.modulosIds, newModel._id],
    } as UpdateCursoInput;

    await this.cursoService.update(cursoId, dtoUpdateCurso, userid);

    return newModel;
  }

  async findById(moduloId: Types.ObjectId): Promise<Modulo> {
    const modulo = super.findById_WithNestedSubDocuments_ActiveOrInactive(
      moduloId,
      'unidades', // Subdocumento relacionado que se desea incluir.
      'material', // Subdocumento relacionado que se desea incluir.
      false,
      false,
      false,
    );

    return modulo;
  }

  async findAll(pagination?: PaginationArgs): Promise<Modulo[]> {
    const { limit, offset } = pagination;

    const query = { deleted: false };

    const modulos = await this.moduloModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    return modulos;
  }

  async findByCursoId(cursoId: Types.ObjectId): Promise<Modulo[]> {
    const modulos = await this.moduloModel.find({ cursoId }).exec();
    return modulos;
  }

  async update(
    idModule: Types.ObjectId,
    updateDto: Partial<UpdateModuloInput>,
    idUpdatedBy: Types.ObjectId,
  ): Promise<Modulo> {
    if (!updateDto.numeroModulo) {
      const moduloUpdate = super.update(idModule, updateDto, idUpdatedBy);
      return moduloUpdate;
    } else {
      const moduloCurrent = await this.moduloModel.findById(idModule);

      if (!moduloCurrent) {
        throw new NotFoundException(
          `El módulo con ID ${idModule} no fue encontrado.`,
        );
      }

      // 🔹 Verifica si ya existe un módulo con el mismo cursoId y numeroModulo
      const existingModulo = await this.moduloModel.findOne({
        cursoId: moduloCurrent.cursoId,
        numeroModulo: updateDto.numeroModulo,
      });

      if (existingModulo) {
        throw new NotFoundException(
          `Ya existe un módulo con numeroModulo: ${updateDto.numeroModulo} en el cursoId: ${moduloCurrent.cursoId}`,
        );
      }
      const moduloUpdate = super.update(idModule, updateDto, idUpdatedBy);
      return moduloUpdate;
    }
  }

  async softDelete(
    idDelete: Types.ObjectId,
    idThanos: Types.ObjectId,
  ): Promise<Modulo> {
    const moduloDelete = await super.softDelete(idDelete, idThanos);
    const curso = await this.cursoService.findById(moduloDelete.cursoId);
    const modulosIds = curso.modulosIds;
    const updateModulosIds = modulosIds.filter(
      (id) => String(id) !== String(idDelete),
    );

    await this.cursoService.update(
      moduloDelete.cursoId,
      { modulosIds: updateModulosIds },
      idThanos,
    );

    return moduloDelete;
  }

  async restore(
    idRestore: Types.ObjectId,
    updatedBy: Types.ObjectId,
  ): Promise<Modulo> {
    const Allmodulodeleted = await super.findSoftDeleted();
    const modulodeleted = Allmodulodeleted.find(
      (modulo) => String(modulo._id) === String(idRestore),
    );

    if (!modulodeleted) {
      throw new NotFoundException(
        `El módulo con ID ${idRestore} no fue encontrado.`,
      );
    }
    // 🔹 Verifica si ya existe un módulo con el mismo cursoId y numeroModulo
    const existingModulo = await this.moduloModel.findOne({
      cursoId: modulodeleted.cursoId,
      numeroModulo: modulodeleted.numeroModulo,
    });

    if (existingModulo) {
      throw new NotFoundException(
        `Ya existe un módulo con numeroModulo: ${modulodeleted.numeroModulo} en el cursoId: ${modulodeleted.cursoId}`,
      );
    }

    const moduloRestore = await super.restore(idRestore, updatedBy);
    const curso = await this.cursoService.findById(moduloRestore.cursoId);
    const modulosIds = [...curso.modulosIds]; // ✅ Evita problemas de mutabilidad

    if (!modulosIds.includes(moduloRestore._id)) {
      modulosIds.push(moduloRestore._id);
    }

    await this.cursoService.update(
      moduloRestore.cursoId,
      { modulosIds },
      updatedBy,
    );

    return moduloRestore;
  }
}
