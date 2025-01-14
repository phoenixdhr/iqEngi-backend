import { Modulo } from '../entities/modulo.entity';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayService } from 'src/common/services/base-array.service';
import { Unidad } from '../entities/unidad.entity';
import { UpdateMaterialInput } from '../dtos/material-dtos/update-material.input';
import { CreateMaterialInput } from '../dtos/material-dtos/create-material.input';

@Injectable()
export class MaterialService extends BaseArrayService<
  Unidad,
  CreateMaterialInput,
  UpdateMaterialInput,
  Modulo
> {
  constructor(
    @InjectModel(Unidad.name)
    private readonly unidadModel: Model<Unidad>, // Modelo de la entidad Unidad en MongoDB.
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo de la entidad Modulo en MongoDB.
  ) {
    super(unidadModel, moduloModel); // Inicializa la clase base con los modelos.
  }

  // MEtodo para hacer push de un material a una unidad.
  async pushToArray(
    idUnidad: Types.ObjectId,
    updateBy: Types.ObjectId,
    createMaterialInput: CreateMaterialInput,
  ): Promise<Modulo> {
    // Retorna el modulo actualizado.
    return super.pushToArray(
      idUnidad,
      updateBy,
      createMaterialInput,
      'materiales',
    );
  }

  async _findAllByIdUnidad(idUnidad: Types.ObjectId): Promise<Unidad> {
    return this.unidadModel.findById(idUnidad);
  }

  // Metodo para actualizar un material de una unidad.
  async updateInArray(
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
    updateBy: Types.ObjectId,
    updateMaterialInput: UpdateMaterialInput,
  ): Promise<Modulo> {
    // Retorna el modulo actualizado.
    return super.updateInArray(
      idUnidad,
      idMaterial,
      updateBy,
      updateMaterialInput,
      'materiales',
    );
  }

  // Metodo para eliminar con softdelete un material de una unidad.
  async softDelete(
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
    updateBy: Types.ObjectId,
  ): Promise<Modulo> {
    // Retorna el modulo actualizado.
    return super.softDelete(idUnidad, idMaterial, updateBy, 'materiales');
  }

  // Metodo para restaurar con softdelete un material de una unidad.
  async restore(
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
    updateBy: Types.ObjectId,
  ): Promise<Modulo> {
    // Retorna el modulo actualizado.
    return super.restore(idUnidad, idMaterial, updateBy, 'materiales');
  }

  // Metodo para hard elete un material de una unidad con la funcion pullIfDeleted.
  async pullIfDeleted(
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
  ): Promise<Modulo> {
    // Retorna el modulo actualizado.
    return super.pullIfDeleted(idUnidad, idMaterial, 'materiales');
  }

  // Metodo para eliminar todas las materias (hard delete) de una unidad.
  async pullAllDeleted(idUnidad: Types.ObjectId): Promise<number> {
    // Retorna el modulo actualizado.
    return super.pullAllDeleted(idUnidad, 'materiales');
  }
}
