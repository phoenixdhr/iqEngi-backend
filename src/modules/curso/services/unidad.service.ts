import { Unidad } from '../entities/unidad.entity';
import { CreateUnidadInput } from '../dtos/unidad-dtos/create-unidad.input';
import { UpdateUnidadInput } from '../dtos/unidad-dtos/update-unidad.input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayWithNestedArrayService } from 'src/common/services/base-array-with-nested-array.service';
import { ModuloService } from './modulo.service';
import { Modulo } from '../entities/modulo.entity';

@Injectable()
export class UnidadService extends BaseArrayWithNestedArrayService<
  Modulo,
  CreateUnidadInput,
  UpdateUnidadInput,
  Unidad
> {
  constructor(
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo de la entidad Modulo en MongoDB.
    @InjectModel(Unidad.name)
    private readonly unidadModel: Model<Unidad>, // Modelo de la entidad Unidad en MongoDB.
    private readonly moduloService: ModuloService,
  ) {
    super(moduloModel, unidadModel); // Inicializa la clase base con los modelos.
  }

  /**
   * Agrega una nueva unidad al array `unidades` dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo donde se agregará la unidad.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nuevaUnidad Datos de la nueva unidad a agregar.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad agregada.
   */
  async pushToArray(
    moduloId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nuevaUnidad: CreateUnidadInput,
    nombreArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    const nuevoNumeroUnidad = nuevaUnidad.numeroUnidad;

    if (!nuevoNumeroUnidad) {
      return super.pushToArray(
        moduloId,
        usuarioId,
        { ...nuevaUnidad, moduloId },
        nombreArray,
      );
    } else {
      const currentModulo = await this.moduloModel.findById(moduloId).exec();
      const existNumeroUnidad = currentModulo.unidades.some(
        (obj) => String(obj.numeroUnidad) === String(nuevoNumeroUnidad),
      );

      if (existNumeroUnidad) {
        throw new NotFoundException(
          `Ya existe una unidad con numeroUnidad: ${nuevoNumeroUnidad} en el modulo: ${moduloId}`,
        );
      }

      return super.pushToArray(
        moduloId,
        usuarioId,
        { ...nuevaUnidad, moduloId },
        nombreArray,
      );
    }
  }

  /**
   * Recupera una unidad específica dentro del array `unidades` de un módulo.
   *
   * @param ModuloId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a buscar.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad encontrada.
   */
  async _findById(
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    nombreArray: keyof Modulo = 'unidades',
    arrayNestedName: keyof Unidad = 'materiales',
  ): Promise<Unidad> {
    return super.findById(
      moduloId,
      unidadId,
      nombreArray,
      arrayNestedName,
      false,
      false,
      false,
    );
  }

  /**
   * Obtiene todas las unidades eliminadas lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene las unidades.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns Una lista de unidades eliminadas lógicamente.
   */
  async findSoftDeleted(moduloId: Types.ObjectId): Promise<Unidad[]> {
    const modulo =
      await this.moduloService.findById_WithNestedSubDocuments_ActiveOrInactive(
        moduloId,
        'unidades',
        'materiales',
        false,
        true,
        false,
      );

    return modulo.unidades;
  }

  /**
   * Actualiza una unidad existente dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a actualizar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param unidadActualizada Datos actualizados para la unidad.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad actualizada.
   */
  async updateInArray(
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    unidadActualizada: UpdateUnidadInput,
    nombreArray: keyof Modulo = 'unidades',
    nombreSubArray: keyof Unidad = 'materiales',
  ): Promise<Unidad> {
    const nuevoNumeroUnidad = unidadActualizada.numeroUnidad;

    if (!nuevoNumeroUnidad) {
      return super.updateInArray(
        moduloId,
        unidadId,
        usuarioId,
        unidadActualizada,
        nombreArray,
        nombreSubArray,
      );
    } else {
      const currentModulo = await this.moduloModel.findById(moduloId).exec();
      const existNumeroUnidad = currentModulo.unidades.some(
        (obj) => String(obj.numeroUnidad) === String(nuevoNumeroUnidad),
      );

      if (existNumeroUnidad) {
        throw new NotFoundException(
          `Ya existe una unidad con numeroUnidad: ${nuevoNumeroUnidad} en el modulo: ${moduloId}`,
        );
      }

      return super.updateInArray(
        moduloId,
        unidadId,
        usuarioId,
        unidadActualizada,
        nombreArray,
        nombreSubArray,
      );
    }
  }

  /**
   * Elimina lógicamente una unidad dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a eliminar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad eliminada lógicamente.
   */
  async softDelete(
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nombreArray: keyof Modulo = 'unidades',
    nombreSubArray: keyof Unidad = 'materiales',
  ): Promise<Unidad> {
    return super.softDelete(
      moduloId,
      unidadId,
      usuarioId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Restaura una unidad eliminada lógicamente dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a restaurar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad restaurada.
   */
  async restore(
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nombreArray: keyof Modulo = 'unidades',
    nombreSubArray: keyof Unidad = 'materiales',
  ): Promise<Unidad> {
    const moduloWithUnidadesDeleted =
      await super.findById_WithNestedSubDocuments_ActiveOrInactive(
        moduloId,
        'unidades',
        'materiales',
        false,
        true,
        false,
      );

    const unidadesArrayDeleted = moduloWithUnidadesDeleted.unidades;

    const unidadDeleted = unidadesArrayDeleted.find(
      (unidad) => String(unidad._id) === String(unidadId),
    );

    if (!unidadDeleted) {
      throw new NotFoundException(
        `La unidad no existe o ya ha sido recuperado en el modulo: ${moduloId}`,
      );
    }

    const currentModulo = await this.moduloService.findById(moduloId);
    const existNumeroUnidad = currentModulo.unidades.some(
      (obj) => String(obj.numeroUnidad) === String(unidadDeleted.numeroUnidad),
    );

    if (existNumeroUnidad) {
      throw new NotFoundException(
        `Ya existe una unidad con numeroUnidad: ${unidadDeleted.numeroUnidad} en el modulo: ${moduloId}`,
      );
    }

    return super.restore(
      moduloId,
      unidadId,
      usuarioId,
      nombreArray,
      nombreSubArray,
      false,
      true,
      false,
    );
  }

  /**
   * Elimina permanentemente una unidad marcada como eliminada lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a eliminar permanentemente.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad eliminada permanentemente.
   */
  async pullIfDeleted(
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    nombreArray: keyof Modulo = 'unidades',
    nombreSubArray: keyof Unidad = 'materiales',
  ): Promise<Unidad> {
    return super.pullIfDeleted(moduloId, unidadId, nombreArray, nombreSubArray);
  }

  /**
   * Elimina permanentemente todas las unidades marcadas como eliminadas lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param arrayName Nombre del array secundario (por defecto: 'unidades').
   * @returns Una lista de unidades eliminadas permanentemente.
   */
  async pullAllDeleted(
    moduloId: Types.ObjectId,
    arrayName: keyof Modulo = 'unidades',
  ): Promise<Unidad[]> {
    return super.pullAllDeleted(moduloId, arrayName);
  }
}
