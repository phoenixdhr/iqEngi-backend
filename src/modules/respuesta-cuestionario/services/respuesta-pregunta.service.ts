import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { CuestionarioService } from 'src/modules/cuestionario/services/cuestionario.service';
import { TipoPregunta } from 'src/common/enums';
import { RespuestaDataInput } from '../dtos/respuesta-pregunta-dtos/create-respuestaData.dto';

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
    @Inject(forwardRef(() => RespuestaCuestionarioService)) // 🔥 SOLUCIÓN
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService, // Servicio para operaciones relacionadas con RespuestaCuestionario.
    private readonly cuestionarioService: CuestionarioService, // Servicio para operaciones relacionadas con Cuestionario.
  ) {
    super(respuestaCuestionarioModel, respuestaPreguntaModel); // Inicializa la clase base con los modelos proporcionados.
  }

  /*   *
   * Agrega una nueva respuesta a la lista de respuestas (`respuestas`) de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario donde se agregará la respuesta.
   * @param idUser ID del usuario que realiza la operación.
   * @param element Datos de la nueva respuesta.
   * @param arrayName Nombre del array donde se almacenan las respuestas (por defecto: 'respuestas').
   * @returns La respuesta agregada al cuestionario.
   */

  async _pushToArray(
    idCurso: Types.ObjectId,
    idUser: Types.ObjectId,
    element: CreateRespuestaPreguntaInput,
    arrayName: keyof RespuestaCuestionario = 'respuestas',
  ): Promise<RespuestaPregunta> {
    const { preguntaId, respuestaId, respuestaAbierta } = element;

    // 1️⃣ Buscar la respuesta del usuario en el cuestionario
    const respuestasCuestionarioUser =
      await this.respuestaCuestionarioService.findByUsuarioId(idUser);

    const respuestaCuestionarioUser = respuestasCuestionarioUser.find(
      (respuestaCuestionario) =>
        String(respuestaCuestionario.cursoId) === String(idCurso),
    );

    if (!respuestaCuestionarioUser) {
      throw new Error(
        'El usuario no ha comprado el curso asociado al cuestionario.',
      );
    }

    const { cuestionarioId, _id: idRespuestaCuestionario } =
      respuestaCuestionarioUser;

    // 2️⃣ Buscar el cuestionario asociado
    const cuestionario = await this.cuestionarioModel
      .findById(cuestionarioId)
      .exec();

    if (!cuestionario) {
      throw new Error(
        `No se encontró un cuestionario activo con ID: ${cuestionarioId}.`,
      );
    }

    // 3️⃣ Buscar la pregunta en el cuestionario
    const pregunta = cuestionario.preguntas.find(
      (p) => String(p._id) === String(preguntaId),
    );

    const tipoPregunta = pregunta.tipoPregunta;

    if (!pregunta) {
      throw new Error(`No se encontró una pregunta con ID: ${preguntaId}.`);
    }

    // 4️⃣ Verificar que la pregunta no haya sido respondida previamente
    const preguntaYaRespondida = respuestaCuestionarioUser.respuestas.some(
      (respuesta) => String(respuesta.preguntaId) === String(preguntaId),
    );

    if (preguntaYaRespondida) {
      throw new Error('La pregunta ya ha sido respondida.');
    }

    // 5️⃣ Validar la respuesta según el tipo de pregunta
    let nuevaRespuesta: RespuestaPregunta;

    switch (tipoPregunta) {
      case TipoPregunta.ABIERTA:
        if (!respuestaAbierta) {
          throw new Error('Debe proporcionar una respuesta escrita.');
        }
        nuevaRespuesta = await super.pushToArray(
          idRespuestaCuestionario,
          idUser,
          {
            preguntaId: new Types.ObjectId(preguntaId),
            tipoPregunta,
            respuestaAbierta,
          },
          arrayName,
        );
        break;

      case TipoPregunta.ALTERNATIVA:
        if (!respuestaId || respuestaId.length !== 1) {
          throw new Error(
            'Debe seleccionar una única opción para preguntas de tipo alternativa.',
          );
        }
        nuevaRespuesta = await this.guardarRespuesta(
          idRespuestaCuestionario,
          idUser,
          preguntaId,
          respuestaId,
          tipoPregunta,
          arrayName,
        );
        break;

      case TipoPregunta.OPCION_MULTIPLE:
        if (!respuestaId || respuestaId.length === 0) {
          throw new Error(
            'Debe seleccionar al menos una opción en preguntas de opción múltiple.',
          );
        }
        nuevaRespuesta = await this.guardarRespuesta(
          idRespuestaCuestionario,
          idUser,
          preguntaId,
          respuestaId,
          tipoPregunta,
          arrayName,
        );
        break;

      case TipoPregunta.ORDENAMIENTO:
        if (!respuestaId || respuestaId.length < 2) {
          throw new Error(
            `Debe proporcionar un orden válido de opciones para preguntas de ordenamiento con ID ${preguntaId}.`,
          );
        }
        nuevaRespuesta = await this.guardarRespuesta(
          idRespuestaCuestionario,
          idUser,
          preguntaId,
          respuestaId,
          tipoPregunta,
          arrayName,
        );
        break;

      default:
        throw new Error('Tipo de pregunta no reconocido.');
    }

    // 6️⃣ Recuperar la respuesta recién agregada con `populate`
    const respuestaCuestionario = await this.respuestaCuestionarioModel
      .findOne(
        {
          _id: idRespuestaCuestionario,
          [`${arrayName}._id`]: nuevaRespuesta._id,
        },
        { [`${arrayName}.$`]: 1 },
      )
      .populate(`${arrayName}`)
      .exec();

    respuestaCuestionario.populate(`${arrayName}.respuestaId`);

    return respuestaCuestionario[arrayName][0];
  }

  /**
   * Método auxiliar para evitar código duplicado al guardar respuestas.
   */
  private async guardarRespuesta(
    idRespuestaCuestionario: Types.ObjectId,
    idUser: Types.ObjectId,
    preguntaId: Types.ObjectId,
    respuestaId: RespuestaDataInput[],
    tipoPregunta: TipoPregunta,
    arrayName: keyof RespuestaCuestionario,
  ): Promise<RespuestaPregunta> {
    return await super.pushToArray(
      idRespuestaCuestionario,
      idUser,
      { preguntaId: new Types.ObjectId(preguntaId), tipoPregunta, respuestaId },
      arrayName,
    );
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
      false,
      false,
      false,
    );
  }

  async findAll(idRespuestaCuestionario: Types.ObjectId) {
    return this.respuestaCuestionarioService.findById(idRespuestaCuestionario);
  }

  /**
   * Recupera un subdocumento específico por su ID dentro de un documento principal.
   * @param idModelo - ID del documento principal.
   * @param idPregunta - ID del subdocumento a buscar.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreSubCampoNestedArreglo - Nombre del campo arreglo dentro del subdocumento.
   * @returns El subdocumento encontrado.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento.
   */
  async _findById(
    idCurso: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    nombreCampoArreglo: keyof RespuestaCuestionario = 'respuestas',
    nombreSubCampoNestedArreglo: keyof RespuestaPregunta = 'respuestaId',
  ): Promise<RespuestaPregunta> {
    // Busca las respuestas asociadas al usuario
    const respuestasCuestionarioUser =
      await this.respuestaCuestionarioService.findByUsuarioId(idUser);

    // Encuentra la respuesta del cuestionario asociada al curso
    const respuestaCuestionarioUser = respuestasCuestionarioUser.find(
      (respuestaCuestionario) =>
        String(respuestaCuestionario.cursoId) === String(idCurso),
    );

    if (!respuestaCuestionarioUser) {
      throw new Error(
        'El usuario no ha comprado el curso asociado al cuestionario.',
      );
    }

    const { _id: idRespuestaCuestionario } = respuestaCuestionarioUser;

    // Obtener el documento con subdocumentos filtrados
    const documento =
      await this.findById_WithNestedSubDocuments_ActiveOrInactive(
        idRespuestaCuestionario,
        String(nombreCampoArreglo),
        String(nombreSubCampoNestedArreglo),
        false,
        false,
        false,
      );

    const arregloSubDocumentos = documento[
      nombreCampoArreglo
    ] as unknown as RespuestaPregunta[];

    // Buscar el subdocumento por ID
    const subdocumento = arregloSubDocumentos.find(
      (subDoc) => String(subDoc.preguntaId) === String(idPregunta),
    );

    if (!subdocumento) {
      throw new NotFoundException(
        `Subdocumento ${this.subModelo.collection.name} con ID "${idPregunta}" no encontrado en el documento ${this.modelo.collection.name} con ID "${idRespuestaCuestionario}"`,
      );
    }

    return subdocumento;
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
      false,
      true,
      false,
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
        false,
        true,
        false,
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

  //LAS RESPUESTAS PARA LAS PREGUNTAS DE ORDENAMIENTO NO ESTA TOTALMENTE DEFINIDA, AL ALMACENAR EL ORDEN DE LAS RESPUESTAS, NO SE GUARDAN EN UN ORODEN ESPECIFICO, POR LO QUE NO SE PUEDE SABER SI LA RESPUESTA ES CORRECTA O NO. POR ESTABLECER LOGICA DE ORDENAMIENTO DE RESPUESTAS
}
