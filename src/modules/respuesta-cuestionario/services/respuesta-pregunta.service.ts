import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayWithNestedArrayService } from 'src/common/services/base-array-with-nested-array.service';
import { RespuestaCuestionario } from '../entities/respuesta-cuestionario.entity';
import { CreateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/create-respuesta-pregunta.dto';
import { UpdateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/update-respuesta-pregunta.dto';
import { RespuestaPregunta } from '../entities/respuesta-pregunta.entity';
import { RespuestaCuestionarioService } from './respuesta-cuestionario.service';
// import { CuestionarioService } from 'src/modules/cuestionario/services/cuestionario.service';
import { Cuestionario } from 'src/modules/cuestionario/entities/cuestionario.entity';

@Injectable()
export class RespuestaPreguntaService extends BaseArrayWithNestedArrayService<
  RespuestaCuestionario,
  CreateRespuestaPreguntaInput,
  UpdateRespuestaPreguntaInput,
  RespuestaPregunta
> {
  constructor(
    @InjectModel(RespuestaCuestionario.name)
    private readonly respuestaCuestionarioModel: Model<RespuestaCuestionario>, // Modelo Mongoose para RespuestaCuestionario.
    @InjectModel(RespuestaPregunta.name)
    private readonly respuestaPreguntaModel: Model<RespuestaPregunta>, // Modelo Mongoose para RespuestaPregunta.
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>, // Modelo Mongoose para Cuestionario.
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService, // Servicio para operaciones relacionadas con RespuestaCuestionario.
    // private readonly cuestionarioService: CuestionarioService, // Servicio para operaciones relacionadas con Cuestionario.
  ) {
    super(respuestaCuestionarioModel, respuestaPreguntaModel); // Inicializa la clase base con los modelos proporcionados.
  }

  /**
   * Agrega una nueva respuesta a la lista de respuestas (`respuestas`) de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario donde se agregará la respuesta.
   * @param idUser ID del usuario que realiza la operación.
   * @param element Datos de la nueva respuesta.
   * @param arrayName Nombre del array donde se almacenan las respuestas (por defecto: 'respuestas').
   * @returns La respuesta agregada al cuestionario.
   */
  async pushToArray(
    idRespuestaCuestionario: Types.ObjectId,
    idUser: Types.ObjectId,
    element: CreateRespuestaPreguntaInput,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    idCuestionario?: Types.ObjectId,
  ): Promise<RespuestaPregunta> {
    // Verifica si el cuestionario existe y está activo
    const cuestionario = (
      await this.cuestionarioModel.findById(idCuestionario).exec()
    ).toObject();

    console.log('preguntas:', cuestionario);

    if (!cuestionario) {
      throw new Error(
        `No se encontró un cuestionario activo con ID: ${idCuestionario}.`,
      );
    }

    const { preguntaId, respuestaId } = element;

    // Verifica si la pregunta y la respuesta existen y están activas
    const pregunta = cuestionario.preguntas.find((pregunta) => {
      console.log('pregunta_1:', pregunta._id);
      console.log('pregunta_1:', preguntaId);
      return String(pregunta._id) === String(preguntaId);
    });

    if (!pregunta) {
      throw new Error(
        `No se encontró una pregunta activa con ID: ${preguntaId}.`,
      );
    }

    const respuesta = pregunta.opciones.find((opcion) =>
      respuestaId.find((id) => id === opcion._id),
    );

    if (!respuesta) {
      throw new Error(
        `No se encontró una respuesta activa con ID: ${respuestaId}.`,
      );
    }

    const nuevaRespuesta = await super.pushToArray(
      idRespuestaCuestionario,
      idUser,
      element,
      arrayName,
    );

    // Ahora hacemos una consulta para obtener esa respuesta con populate
    const respuestaCuestionario = await this.respuestaCuestionarioModel
      .findOne(
        {
          _id: idRespuestaCuestionario,
          [`${arrayName}._id`]: nuevaRespuesta._id,
        },
        { [`${arrayName}.$`]: 1 }, // Proyección: solo retorna la respuesta agregada
      )
      .populate(`${arrayName}`) // Realiza el populate
      .exec();

    // cuestionario[arrayName][0] corresponde a la respuesta recién insertada con sus opcionIds populadas
    return respuestaCuestionario[arrayName][0];
  }

  /**
   * Busca una respuesta específica dentro del array `respuestas` de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la respuesta.
   * @param idRespuestaPregunta ID de la respuesta a buscar.
   * @param arrayName Nombre del array donde se encuentran las respuestas (por defecto: 'respuestas').
   * @param arrayNestedName Nombre del subarray dentro de la respuesta (por defecto: 'opcionIds').
   * @returns La respuesta encontrada.
   */
  async findById(
    idRespuestaCuestionario: Types.ObjectId,
    idRespuestaPregunta: Types.ObjectId,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'respuestaId',
  ): Promise<RespuestaPregunta> {
    return super.findById(
      idRespuestaCuestionario,
      idRespuestaPregunta,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Actualiza una respuesta existente dentro del array `respuestas` de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la respuesta.
   * @param idRespuestaPregunta ID de la respuesta a actualizar.
   * @param idUser ID del usuario que realiza la operación.
   * @param updatePreguntaInput Datos actualizados de la respuesta.
   * @param arrayName Nombre del array donde se encuentran las respuestas (por defecto: 'respuestas').
   * @param arrayNestedName Nombre del subarray dentro de la respuesta (por defecto: 'opcionIds').
   * @returns La respuesta actualizada.
   */
  async updateInArray(
    idRespuestaCuestionario: Types.ObjectId,
    idRespuestaPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    updatePreguntaInput: UpdateRespuestaPreguntaInput,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'respuestaId',
  ): Promise<RespuestaPregunta> {
    return super.updateInArray(
      idRespuestaCuestionario,
      idRespuestaPregunta,
      idUser,
      updatePreguntaInput,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Marca una respuesta específica como eliminada lógicamente en un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la respuesta.
   * @param idRespuestaPregunta ID de la respuesta a eliminar lógicamente.
   * @param idUser ID del usuario que realiza la operación.
   * @param arrayName Nombre del array donde se encuentran las respuestas (por defecto: 'respuestas').
   * @param arrayNestedName Nombre del subarray dentro de la respuesta (por defecto: 'opcionIds').
   * @returns La respuesta marcada como eliminada.
   */
  async softDelete(
    idRespuestaCuestionario: Types.ObjectId,
    idRespuestaPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'respuestaId',
  ): Promise<RespuestaPregunta> {
    return super.softDelete(
      idRespuestaCuestionario,
      idRespuestaPregunta,
      idUser,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Restaura una respuesta que ha sido marcada como eliminada lógicamente.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la respuesta.
   * @param idRespuestaPregunta ID de la respuesta a restaurar.
   * @param idUser ID del usuario que realiza la operación.
   * @param arrayName Nombre del array donde se encuentran las respuestas (por defecto: 'respuestas').
   * @param arrayNestedName Nombre del subarray dentro de la respuesta (por defecto: 'opcionIds').
   * @returns La respuesta restaurada.
   */
  async restore(
    idRespuestaCuestionario: Types.ObjectId,
    idRespuestaPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'respuestaId',
  ): Promise<RespuestaPregunta> {
    return super.restore(
      idRespuestaCuestionario,
      idRespuestaPregunta,
      idUser,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Obtiene todas las respuestas marcadas como eliminadas lógicamente en un cuestionario.
   *
   * @param cuestionarioId ID del cuestionario.
   * @returns Una lista de respuestas eliminadas lógicamente.
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
   * Elimina permanentemente una respuesta marcada como eliminada lógicamente.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la respuesta.
   * @param idRespuestaPregunta ID de la respuesta a eliminar definitivamente.
   * @param arrayName Nombre del array donde se encuentran las respuestas (por defecto: 'respuestas').
   * @returns La respuesta eliminada permanentemente.
   */
  async pullIfDeleted(
    idRespuestaCuestionario: Types.ObjectId,
    idRespuestaPregunta: Types.ObjectId,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
    arrayNestedName: keyof RespuestaPregunta = 'respuestaId',
  ): Promise<RespuestaPregunta> {
    return super.pullIfDeleted(
      idRespuestaCuestionario,
      idRespuestaPregunta,
      arrayName,
      arrayNestedName,
    );
  }

  /**
   * Elimina permanentemente todas las respuestas marcadas como eliminadas lógicamente en un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario.
   * @param arrayName Nombre del array donde se encuentran las respuestas (por defecto: 'respuestas').
   * @returns Una lista de respuestas eliminadas permanentemente.
   */
  async pullAllDeleted(
    idRespuestaCuestionario: Types.ObjectId,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
  ): Promise<RespuestaPregunta[]> {
    return super.pullAllDeleted(idRespuestaCuestionario, arrayName);
  }
}
