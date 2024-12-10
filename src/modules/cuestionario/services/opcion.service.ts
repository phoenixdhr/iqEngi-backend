import { Injectable } from '@nestjs/common';
import { Pregunta } from '../entities/pregunta.entity';
import { Cuestionario } from '../entities/cuestionario.entity';
import { Opcion } from '../entities/opcion.entity';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';
import { UpdateOpcionInput } from '../dtos/opcion-dtos/update-opcion.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseNestedArrayService } from 'src/common/services/base-nested-array.service';

@Injectable()
export class OpcionService extends BaseNestedArrayService<
  Cuestionario,
  CreateOpcionInput,
  UpdateOpcionInput,
  Pregunta,
  Opcion
> {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>, // Modelo de Cuestionario en MongoDB.
    @InjectModel(Pregunta.name)
    private readonly preguntaModel: Model<Pregunta>, // Modelo de Pregunta en MongoDB.
    @InjectModel(Opcion.name)
    private readonly opcionModel: Model<Opcion>, // Modelo de Opcion en MongoDB.
  ) {
    super(cuestionarioModel, preguntaModel, opcionModel); // Inicializa la clase base con los modelos.
  }

  /**
   * Añade una nueva opción al array `opciones` de una pregunta.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a la que se agregará la opción.
   * @param element Datos de la nueva opción.
   * @param arrayName Nombre del array donde se almacenan las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se almacenan las opciones (por defecto: 'opciones').
   * @returns La opción agregada.
   */
  async pushToNestedArray(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    createdBy: Types.ObjectId,
    element: CreateOpcionInput,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    return super.pushToNestedArray(
      idCuestionario,
      idPregunta,
      createdBy,
      element,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Recupera una opción específica dentro del array `opciones` de una pregunta.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a buscar.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns La opción encontrada.
   */
  async findById(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idOpcion: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    return super.findById(
      idCuestionario,
      idPregunta,
      idOpcion,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Obtiene todas las opciones eliminadas lógicamente de una pregunta específica.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene las opciones.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns Una lista de opciones eliminadas lógicamente.
   */
  async findSoftDeleted(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion[]> {
    return super.findSoftDeleted(
      idCuestionario,
      idPregunta,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Actualiza una opción existente dentro del array `opciones` de una pregunta.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a actualizar.
   * @param idUser ID del usuario que realiza la operación.
   * @param updateOpcionInput Datos para actualizar la opción.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns La opción actualizada.
   */
  async updateInNestedArray(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idOpcion: Types.ObjectId,
    idUser: Types.ObjectId,
    updateOpcionInput: UpdateOpcionInput,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    return super.updateInNestedArray(
      idCuestionario,
      idPregunta,
      idOpcion,
      idUser,
      updateOpcionInput,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Elimina lógicamente una opción dentro del array `opciones` de una pregunta.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a eliminar.
   * @param idUser ID del usuario que realiza la operación.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns La opción eliminada.
   */
  async softDelete(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idOpcion: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    return super.softDelete(
      idCuestionario,
      idPregunta,
      idOpcion,
      idUser,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Restaura una opción eliminada lógicamente.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a restaurar.
   * @param idUser ID del usuario que realiza la operación.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns La opción restaurada.
   */
  async restore(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idOpcion: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    return super.restore(
      idCuestionario,
      idPregunta,
      idOpcion,
      idUser,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Elimina permanentemente una opción marcada como eliminada lógicamente.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a eliminar permanentemente.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns La opción eliminada permanentemente.
   */
  async pullIfDeleted(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idOpcion: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    return super.pullIfDeleted(
      idCuestionario,
      idPregunta,
      idOpcion,
      arrayName,
      subArrayName,
    );
  }

  /**
   * Elimina permanentemente todas las opciones marcadas como eliminadas lógicamente.
   *
   * @param idCuestionario ID del cuestionario.
   * @param idPregunta ID de la pregunta.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se encuentran las opciones (por defecto: 'opciones').
   * @returns Una lista de opciones eliminadas permanentemente.
   */
  async pullAllDeleted(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion[]> {
    return super.pullAllDeleted(
      idCuestionario,
      idPregunta,
      arrayName,
      subArrayName,
    );
  }
}
