import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pregunta } from '../entities/pregunta.entity';
import { Cuestionario } from '../entities/cuestionario.entity';
import { Opcion } from '../entities/opcion.entity';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';
import { UpdateOpcionInput } from '../dtos/opcion-dtos/update-opcion.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseNestedArrayService } from 'src/common/services/base-nested-array.service';
import { TipoPregunta } from 'src/common/enums';
import { PreguntaService } from './pregunta.service';
import { CuestionarioService } from './cuestionario.service';

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
    private readonly preguntaService: PreguntaService, // Servicio para interactuar con preguntas.
    private readonly cuestionarioService: CuestionarioService, // Servicio para interactuar con cuestionarios.
  ) {
    super(cuestionarioModel, preguntaModel, opcionModel); // Inicializa la clase base con los modelos.
  }

  /**
   * Añade una nueva opción al array `opciones` de una pregunta.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a la que se agregará la opción.
   * @param createOpcionInput Datos de la nueva opción.
   * @param arrayName Nombre del array donde se almacenan las preguntas (por defecto: 'preguntas').
   * @param subArrayName Nombre del subarray donde se almacenan las opciones (por defecto: 'opciones').
   * @returns La opción agregada.
   */
  async pushToNestedArray(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    createdBy: Types.ObjectId,
    createOpcionInput: CreateOpcionInput,
    arrayName: keyof Cuestionario = 'preguntas',
    subArrayName: keyof Pregunta = 'opciones',
  ): Promise<Opcion> {
    // Se busca la pregunta en el cuestionario indicado
    const pregunta = await this.preguntaService._findById(
      idCuestionario,
      idPregunta,
    );
    if (!pregunta) {
      throw new NotFoundException('La pregunta no existe.');
    }

    // Se valida la nueva opción según el tipo de pregunta
    await this.validarOpcionPorTipoPregunta(
      pregunta.tipoPregunta,
      pregunta.opciones,
      createOpcionInput,
    );

    return super.pushToNestedArray(
      idCuestionario,
      idPregunta,
      createdBy,
      createOpcionInput,
      arrayName,
      subArrayName,
    );
  }

  async validarOpcionPorTipoPregunta(
    tipoPregunta: TipoPregunta,
    opcionesExistentes: Opcion[],
    nuevaOpcion: CreateOpcionInput,
  ) {
    switch (tipoPregunta) {
      case TipoPregunta.ABIERTA:
        throw new BadRequestException(
          'Las preguntas abiertas no deben tener opciones.',
        );

      case TipoPregunta.ALTERNATIVA:
        // Se limita el número máximo de opciones a 5
        if (opcionesExistentes.length >= 5) {
          throw new BadRequestException(
            'Las preguntas con alternativas no pueden tener más de 5 opciones.',
          );
        }
        // Se permite únicamente una opción correcta
        if (
          opcionesExistentes.some((o) => o.esCorrecta) &&
          nuevaOpcion.esCorrecta
        ) {
          throw new BadRequestException(
            'Solo una opción puede ser correcta en preguntas de tipo alternativa.',
          );
        }
        break;

      case TipoPregunta.OPCION_MULTIPLE:
        // Se limita el número máximo de opciones a 10
        if (opcionesExistentes.length >= 10) {
          throw new BadRequestException(
            'Las preguntas de opción múltiple no pueden tener más de 10 opciones.',
          );
        }
        break;

      case TipoPregunta.ORDENAMIENTO:
        // Se requiere especificar un número de orden y que no se repita
        if (!nuevaOpcion.orden) {
          throw new BadRequestException(
            'Las opciones de preguntas de ordenamiento deben tener un número de orden.',
          );
        }
        if (opcionesExistentes.some((o) => o.orden === nuevaOpcion.orden)) {
          throw new BadRequestException(
            'No puede haber dos opciones con el mismo orden en preguntas de ordenamiento.',
          );
        }
        break;

      default:
        throw new BadRequestException('Tipo de pregunta no reconocido.');
    }
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

  /**
   * Verifica si una pregunta está correctamente definida antes de publicarla.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a validar.
   * @returns Mensaje indicando si la pregunta puede ser publicada.
   */
  async publish(
    idCuestionario: Types.ObjectId,
    idUser: Types.ObjectId,
  ): Promise<Cuestionario> {
    // Se obtiene el cuestionario con todas sus preguntas
    const cuestionario =
      await this.cuestionarioService.findById(idCuestionario);
    if (!cuestionario) {
      throw new NotFoundException('Cuestionario no encontrado.');
    }

    // Se recorre cada pregunta para validar según su tipo
    for (const pregunta of cuestionario.preguntas || []) {
      const opciones = pregunta.opciones || [];
      switch (pregunta.tipoPregunta) {
        case TipoPregunta.ABIERTA:
          // Las preguntas abiertas no deben tener opciones, pero se publican igual
          if (opciones.length > 0) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de tipo abierta no debe tener opciones.`,
            );
          }
          break;

        case TipoPregunta.ALTERNATIVA: {
          if (opciones.length < 2) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de tipo alternativa debe tener al menos 2 opciones.`,
            );
          }
          if (opciones.filter((o) => o.esCorrecta).length !== 1) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de tipo alternativa debe tener exactamente una opción correcta.`,
            );
          }
          break;
        }

        case TipoPregunta.OPCION_MULTIPLE: {
          if (opciones.length < 2) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de opción múltiple debe tener al menos 2 opciones.`,
            );
          }
          if (opciones.every((o) => !o.esCorrecta)) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de opción múltiple debe tener al menos una opción correcta.`,
            );
          }
          break;
        }

        case TipoPregunta.ORDENAMIENTO: {
          if (opciones.length < 2) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de ordenamiento debe tener al menos 2 opciones.`,
            );
          }
          const ordenSet = new Set(opciones.map((o) => o.orden));
          if (ordenSet.size !== opciones.length) {
            throw new BadRequestException(
              `La pregunta ${pregunta._id} de ordenamiento tiene opciones con números de orden duplicados.`,
            );
          }
          break;
        }

        default:
          throw new BadRequestException(
            `Tipo de pregunta no reconocido en la pregunta ${pregunta._id}.`,
          );
      }
    }

    // Si todas las preguntas son válidas, se marca el cuestionario como publicado.
    await this.cuestionarioService.update(
      idCuestionario,
      { published: true },
      idUser,
    );
    return cuestionario;
  }
}
