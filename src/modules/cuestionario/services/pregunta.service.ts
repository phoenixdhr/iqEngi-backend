import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Pregunta } from '../entities/pregunta.entity';
import { UpdatePreguntaInput } from '../dtos/pregunta-dtos/update-pregunta.input';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class PreguntaService extends BaseService<
  Pregunta,
  UpdatePreguntaInput,
  CreatePreguntaInput
> {
  constructor(
    @InjectModel(Pregunta.name)
    private readonly preguntaModel: Model<Pregunta>,
    // private readonly cursoService: CursoService,
  ) {
    super(preguntaModel);
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
    createPreguntaInput: CreatePreguntaInput,
    userId: Types.ObjectId,
  ): Promise<Pregunta> {
    // Crear la nueva pregunta
    const newPregunta = await super.create(createPreguntaInput, userId);

    return newPregunta;
  }
  //#endregion
}
