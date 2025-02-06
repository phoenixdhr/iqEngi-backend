import { Modulo } from '../entities/modulo.entity';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Unidad } from '../entities/unidad.entity';
import { UpdateMaterialInput } from '../dtos/material-dtos/update-material.input';
import { CreateMaterialInput } from '../dtos/material-dtos/create-material.input';
import { Material } from '../entities/material.entity';
import { BaseNestedArrayService } from 'src/common/services/base-nested-array.service';

@Injectable()
export class MaterialService extends BaseNestedArrayService<
  Modulo,
  CreateMaterialInput,
  UpdateMaterialInput,
  Unidad,
  Material
> {
  constructor(
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo de la entidad Modulo en MongoDB.
    @InjectModel(Unidad.name)
    private readonly unidadModel: Model<Unidad>, // Modelo de la entidad Unidad en MongoDB.
    @InjectModel(Material.name)
    private readonly materialModel: Model<Material>, // Modelo de la entidad Unidad en MongoDB.
  ) {
    super(moduloModel, unidadModel, materialModel); // Inicializa la clase base con los modelos.
  }

  // MEtodo para hacer push de un material a una unidad.
  async pushToNestedArray(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
    createdBy: Types.ObjectId,
    createMaterialInput: CreateMaterialInput,
  ): Promise<Material> {
    // Retorna el modulo actualizado.
    return super.pushToNestedArray(
      idModulo,
      idUnidad,
      createdBy,
      createMaterialInput,
      'unidades',
      'materiales',
    );
  }

  async findById(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
  ): Promise<Material> {
    return super.findById(
      idModulo,
      idUnidad,
      idMaterial,
      'unidades',
      'materiales',
    );
  }

  async findSoftDeleted(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
  ): Promise<Material[]> {
    return super.findSoftDeleted(idModulo, idUnidad, 'unidades', 'materiales');
  }

  async updateInNestedArray(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
    idUser: Types.ObjectId,
    updateOpcionInput: UpdateMaterialInput,
  ): Promise<Material> {
    return super.updateInNestedArray(
      idModulo,
      idUnidad,
      idMaterial,
      idUser,
      updateOpcionInput,
      'unidades',
      'materiales',
    );
  }

  // Metodo para eliminar con softdelete un material de una unidad.
  async softDelete(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
    idUser: Types.ObjectId,
  ): Promise<Material> {
    return super.softDelete(
      idModulo,
      idUnidad,
      idMaterial,
      idUser,
      'unidades',
      'materiales',
    );
  }

  // Metodo para restaurar con softdelete un material de una unidad.
  async restore(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
    idUser: Types.ObjectId,
  ): Promise<Material> {
    return super.restore(
      idModulo,
      idUnidad,
      idMaterial,
      idUser,
      'unidades',
      'materiales',
    );
  }

  // Metodo para hard elete un material de una unidad con la funcion pullIfDeleted.
  async pullIfDeleted(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
    idMaterial: Types.ObjectId,
  ): Promise<Material> {
    return super.pullIfDeleted(
      idModulo,
      idUnidad,
      idMaterial,
      'unidades',
      'materiales',
    );
  }

  async pullAllDeleted(
    idModulo: Types.ObjectId,
    idUnidad: Types.ObjectId,
  ): Promise<Material[]> {
    return super.pullAllDeleted(idModulo, idUnidad, 'unidades', 'materiales');
  }
}
