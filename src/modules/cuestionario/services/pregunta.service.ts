import { Injectable } from '@nestjs/common';
import { Pregunta } from '../entities/pregunta.entity';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayWithNestedArrayService } from 'src/common/services/base-array-with-nested-array.service';
import { Cuestionario } from '../entities/cuestionario.entity';
import { UpdatePreguntaInput } from '../dtos/pregunta-dtos/update-pregunta.input';
import { CuestionarioService } from './cuestionario.service';

@Injectable()
export class PreguntaService extends BaseArrayWithNestedArrayService<
  Cuestionario,
  CreatePreguntaInput,
  UpdatePreguntaInput,
  Pregunta
> {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>, // Modelo de Cuestionario en MongoDB.
    @InjectModel(Pregunta.name)
    private readonly preguntaModel: Model<Pregunta>, // Modelo de Pregunta en MongoDB.
    private readonly cuestionarioService: CuestionarioService, // Servicio para interactuar con cuestionarios.
  ) {
    super(cuestionarioModel, preguntaModel); // Inicializa la clase base con los modelos.
  }

  /**
   * Agrega una nueva pregunta al array `preguntas` de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario al que se agregará la pregunta.
   * @param idUser ID del usuario que realiza la operación.
   * @param element Datos de la nueva pregunta.
   * @param arrayName Nombre del array donde se almacenan las preguntas (por defecto: 'preguntas').
   * @returns La pregunta agregada.
   */
  async pushToArray(
    idCuestionario: Types.ObjectId,
    idUser: Types.ObjectId,
    element: CreatePreguntaInput,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.pushToArray(idCuestionario, idUser, element, arrayName);
  }

  /**
   * Busca una pregunta específica dentro del array `preguntas` de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a buscar.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @returns La pregunta encontrada.
   */
  async _findById(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
  ): Promise<Pregunta> {
    return super.findById(
      idCuestionario,
      idPregunta,
      'preguntas',
      'opciones',
      false,
      false,
      false,
    );
  }

  /**
   * Actualiza una pregunta existente dentro del array `preguntas` de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a actualizar.
   * @param idUser ID del usuario que realiza la operación.
   * @param updatePreguntaInput Datos para actualizar la pregunta.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @returns La pregunta actualizada.
   */
  async updateInArray(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    updatePreguntaInput: UpdatePreguntaInput,
  ): Promise<Pregunta> {
    return super.updateInArray(
      idCuestionario,
      idPregunta,
      idUser,
      updatePreguntaInput,
      'preguntas',
      'opciones',
    );
  }

  /**
   * Realiza una eliminación lógica de una pregunta específica.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a eliminar.
   * @param idUser ID del usuario que realiza la operación.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @returns La pregunta eliminada lógicamente.
   */

  async softDelete(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    arrayNestedName: keyof Pregunta = 'opciones',
  ): Promise<Pregunta> {
    return super.softDelete(
      idCuestionario,
      idPregunta,
      idUser,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Restaura una pregunta que ha sido eliminada lógicamente.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a restaurar.
   * @param idUser ID del usuario que realiza la operación.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @returns La pregunta restaurada.
   */
  async restore(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    arrayNestedName: keyof Pregunta = 'opciones',
  ): Promise<Pregunta> {
    return super.restore(
      idCuestionario,
      idPregunta,
      idUser,
      arrayName,
      arrayNestedName,
      false,
      true,
      false,
    );
  }

  /**
   * Obtiene todas las preguntas que han sido eliminadas lógicamente en un cuestionario.
   *
   * @param cuestionarioId ID del cuestionario.
   * @returns Una lista de preguntas eliminadas lógicamente.
   */
  async findSoftDeleted(cuestionarioId: Types.ObjectId): Promise<Pregunta[]> {
    const cuestionario =
      await this.cuestionarioService.findById_WithNestedSubDocuments_ActiveOrInactive(
        cuestionarioId,
        'preguntas',
        'opciones',
        false,
        true,
        false,
      );

    return cuestionario.preguntas;
  }

  /**
   * Elimina permanentemente una pregunta marcada como eliminada lógicamente.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a eliminar definitivamente.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @returns La pregunta eliminada permanentemente.
   */
  async pullIfDeleted(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
    arrayNestedName: keyof Pregunta = 'opciones',
  ): Promise<Pregunta> {
    return super.pullIfDeleted(
      idCuestionario,
      idPregunta,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Elimina permanentemente todas las preguntas que han sido marcadas como eliminadas lógicamente.
   *
   * @param idCuestionario ID del cuestionario.
   * @param arrayName Nombre del array donde se encuentran las preguntas (por defecto: 'preguntas').
   * @returns Una lista de preguntas eliminadas permanentemente.
   */
  async pullAllDeleted(
    idCuestionario: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta[]> {
    return super.pullAllDeleted(idCuestionario, arrayName);
  }
}
