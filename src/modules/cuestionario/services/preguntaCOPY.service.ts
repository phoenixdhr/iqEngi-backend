import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Pregunta } from '../entities/pregunta.entity';
import { UpdatePreguntaInput } from '../dtos/pregunta-dtos/update-pregunta.input';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayService } from 'src/common/services/base-array.service';
import { Cuestionario } from '../entities/cuestionario.entity';

@Injectable()
export class PreguntaServiceCopy extends BaseArrayService<
  Cuestionario,
  CreatePreguntaInput,
  Pregunta
> {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>,
    // private readonly cursoService: CursoService,
  ) {
    super(cuestionarioModel);
  }

  //#region create
  /**
   * Crea una nueva pregunta en la base de datos.
   *
   * @param createPreguntaInput - Datos necesarios para crear la pregunta.
   * @param userId - ID del usuario que está creando la pregunta.
   * @returns La pregunta creada.
   * @throws ConflictException si ya existe una pregunta para el curso especificado.
   */
  async create(
    docId: Types.ObjectId,
    createPreguntaInput: CreatePreguntaInput,
    userId: Types.ObjectId,
  ): Promise<Pregunta> {
    // Crear la nueva pregunta
    const newPregunta = await this.pushToArray(
      docId,
      userId,
      'preguntas',
      createPreguntaInput,
    );
    // const newPregunta = await super.create(createPreguntaInput, userId);

    return newPregunta;
  }
  //#endregion
}
