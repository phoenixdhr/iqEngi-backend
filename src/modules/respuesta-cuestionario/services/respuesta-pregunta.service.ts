// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class RespuestaPreguntaService {}

import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayWithNestedArrayService } from 'src/common/services/base-array-with-nested-array.service';
import { RespuestaCuestionario } from '../entities/respuesta-cuestionario.entity';
import { CreateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/create-respuesta-pregunta.dto';
import { UpdateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/update-respuesta-pregunta.dto';
import { RespuestaPregunta } from '../entities/respuesta-pregunta.entity';
import { RespuestaCuestionarioService } from './respuesta-cuestionario.service';

@Injectable()
export class RespuestaPreguntaService extends BaseArrayWithNestedArrayService<
  RespuestaCuestionario,
  CreateRespuestaPreguntaInput,
  UpdateRespuestaPreguntaInput,
  RespuestaPregunta
> {
  constructor(
    @InjectModel(RespuestaCuestionario.name)
    private readonly cuestionarioModel: Model<RespuestaCuestionario>, // Modelo de RespuestaCuestionario en MongoDB.
    @InjectModel(RespuestaPregunta.name)
    private readonly preguntaModel: Model<RespuestaPregunta>, // Modelo de RespuestaPregunta en MongoDB.
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService, // Servicio para interactuar con cuestionarios.
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
    element: CreateRespuestaPreguntaInput,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
  ): Promise<RespuestaPregunta> {
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
  async findById(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'opciones',
  ): Promise<RespuestaPregunta> {
    return super.findById(
      idCuestionario,
      idPregunta,
      arrayName,
      arrayNestedName,
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
    updatePreguntaInput: UpdateRespuestaPreguntaInput,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'opciones',
  ): Promise<RespuestaPregunta> {
    return super.updateInArray(
      idCuestionario,
      idPregunta,
      idUser,
      updatePreguntaInput,
      arrayName,
      arrayNestedName,
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
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'opciones',
  ): Promise<RespuestaPregunta> {
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
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'opciones',
  ): Promise<RespuestaPregunta> {
    return super.restore(
      idCuestionario,
      idPregunta,
      idUser,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Obtiene todas las preguntas que han sido eliminadas lógicamente en un cuestionario.
   *
   * @param cuestionarioId ID del cuestionario.
   * @returns Una lista de preguntas eliminadas lógicamente.
   */
  async findSoftDeleted(
    cuestionarioId: Types.ObjectId,
  ): Promise<RespuestaPregunta[]> {
    const cuestionario =
      this.respuestaCuestionarioService.findById_WithNestedSubDocuments_ActiveOrInactive(
        cuestionarioId,
        'preguntas',
        'opciones',
        true,
      );

    return (await cuestionario).respuestas;
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
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'opciones',
  ): Promise<RespuestaPregunta> {
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
    arrayName: keyof RespuestaCuestionario = 'respuestas',
  ): Promise<RespuestaPregunta[]> {
    return super.pullAllDeleted(idCuestionario, arrayName);
  }
}
