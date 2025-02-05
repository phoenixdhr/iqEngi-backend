import { BaseNestedArrayService } from 'src/common/services/base-nested-array.service';
import { Unidad } from '../entities/unidad.entity';
import { Modulo } from '../entities/modulo.entity';
import { Curso } from '../entities/curso.entity';
import { CreateUnidadInput } from '../dtos/unidad-dtos/create-unidad.input';
import { UpdateUnidadInput } from '../dtos/unidad-dtos/update-unidad.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UnidadService extends BaseNestedArrayService<
  Curso,
  CreateUnidadInput,
  UpdateUnidadInput,
  Modulo,
  Unidad
> {
  constructor(
    @InjectModel(Curso.name)
    private readonly cursoModel: Model<Curso>, // Modelo de la entidad Curso en MongoDB.
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo de la entidad Modulo en MongoDB.
    @InjectModel(Unidad.name)
    private readonly unidadModel: Model<Unidad>, // Modelo de la entidad Unidad en MongoDB.
  ) {
    super(cursoModel, moduloModel, unidadModel); // Inicializa la clase base con los modelos.
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
  async pushToNestedArray(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nuevaUnidad: CreateUnidadInput,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.pushToNestedArray(
      cursoId,
      moduloId,
      usuarioId,
      nuevaUnidad,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Recupera una unidad específica dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a buscar.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad encontrada.
   */
  async _findById(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.findById(
      cursoId,
      moduloId,
      unidadId,
      nombreArray,
      nombreSubArray,
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
  async findSoftDeleted(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad[]> {
    return super.findSoftDeleted(
      cursoId,
      moduloId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Actualiza una unidad existente dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a actualizar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param datosActualizados Datos actualizados para la unidad.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad actualizada.
   */
  async updateInNestedArray(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    datosActualizados: UpdateUnidadInput,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.updateInNestedArray(
      cursoId,
      moduloId,
      unidadId,
      usuarioId,
      datosActualizados,
      nombreArray,
      nombreSubArray,
    );
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
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.softDelete(
      cursoId,
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
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.restore(
      cursoId,
      moduloId,
      unidadId,
      usuarioId,
      nombreArray,
      nombreSubArray,
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
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.pullIfDeleted(
      cursoId,
      moduloId,
      unidadId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Elimina permanentemente todas las unidades marcadas como eliminadas lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns Una lista de unidades eliminadas permanentemente.
   */
  async pullAllDeleted(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulosIds',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad[]> {
    return super.pullAllDeleted(cursoId, moduloId, nombreArray, nombreSubArray);
  }
}
