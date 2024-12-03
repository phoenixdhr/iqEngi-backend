import { Injectable } from '@nestjs/common';
import { Pregunta } from '../entities/pregunta.entity';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayService } from 'src/common/services/base-array.service';
import { Cuestionario } from '../entities/cuestionario.entity';
import { UpdatePreguntaInput } from '../dtos/pregunta-dtos/update-pregunta.input';
import { CuestionarioService } from './cuestionario.service';

@Injectable()
export class PreguntaServiceCopy extends BaseArrayService<
  Cuestionario,
  CreatePreguntaInput,
  UpdatePreguntaInput,
  Pregunta
> {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>,
    @InjectModel(Pregunta.name)
    private readonly preguntaModel: Model<Pregunta>,
    private readonly cuestionarioService: CuestionarioService,
  ) {
    super(cuestionarioModel, preguntaModel);
  }

  async pushToArray(
    idCuestionario: Types.ObjectId,
    idUser: Types.ObjectId,
    element: CreatePreguntaInput,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.pushToArray(idCuestionario, idUser, element, arrayName);
  }

  // //#region create
  // /**
  //  * Crea una nueva pregunta en la base de datos.
  //  *
  //  * @param createPreguntaInput - Datos necesarios para crear la pregunta.
  //  * @param idUser - ID del usuario que está creando la pregunta.
  //  * @returns La pregunta creada.
  //  * @throws ConflictException si ya existe una pregunta para el curso especificado.
  //  */
  // async create(
  //   idCuestionario: Types.ObjectId,
  //   idUser: Types.ObjectId,
  //   createPreguntaInput: CreatePreguntaInput,
  // ): Promise<Pregunta> {
  //   // Crear la nueva pregunta
  //   const newPregunta = await this.pushToArray(
  //     idCuestionario,
  //     idUser,
  //     createPreguntaInput,
  //     'preguntas',
  //   );
  //   // const newPregunta = await super.create(createPreguntaInput, userId);

  //   return newPregunta;
  // }
  //#endregion

  async findById(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.findById(idCuestionario, idPregunta, arrayName);
  }

  async updateInArray(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    updatePreguntaInput: UpdatePreguntaInput,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.updateInArray(
      idCuestionario,
      idPregunta,
      idUser,
      updatePreguntaInput,
      arrayName,
    );
  }

  // crea el servicio para softDelete donde fieldArrayName sea preguntas
  async softDelete(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.softDelete(idCuestionario, idPregunta, idUser, arrayName);
  }

  async restore(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    idUser: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.restore(idCuestionario, idPregunta, idUser, arrayName);
  }

  async findSoftDeleted(cuestionarioId: Types.ObjectId): Promise<Pregunta[]> {
    const cuestionario =
      this.cuestionarioService.findById_WithSubDocuments_ActiveOrInactive(
        cuestionarioId,
        'preguntas',
        true,
      );

    return (await cuestionario).preguntas;
  }

  async pullIfDeleted(
    idCuestionario: Types.ObjectId,
    idPregunta: Types.ObjectId,
    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta> {
    return super.pullIfDeleted(idCuestionario, idPregunta, arrayName);
  }

  async pullAllDeleted(
    idCuestionario: Types.ObjectId,

    arrayName: keyof Cuestionario = 'preguntas',
  ): Promise<Pregunta[]> {
    return super.pullAllDeleted(idCuestionario, arrayName);
  }
}
