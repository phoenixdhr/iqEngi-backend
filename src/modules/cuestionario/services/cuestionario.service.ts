import { Injectable } from '@nestjs/common';
import { Cuestionario } from '../entities/cuestionario.entity';
import { UpdateCuestionarioInput } from '../dtos/cuestionario-dtos/update-cuestionario.input';
import { CreateCuestionarioInput } from '../dtos/cuestionario-dtos/create-cuestionario.input';
import { BaseService } from 'src/common/services/base.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CursoService } from 'src/modules/curso/services/curso.service';
import { UpdateCursoInput } from 'src/modules/curso/dtos/curso-dtos/update-curso.input';
import { PaginationArgs } from 'src/common/dtos';

@Injectable()
export class CuestionarioService extends BaseService<
  Cuestionario,
  UpdateCuestionarioInput,
  CreateCuestionarioInput
> {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>, // Modelo Mongoose para gestionar los datos de Cuestionario en la base de datos.
    private readonly cursoService: CursoService, // Servicio para interactuar con la entidad Curso.
  ) {
    super(cuestionarioModel); // Inicialización del servicio base con el modelo Cuestionario.
  }

  /**
   * Crea un nuevo cuestionario asociado a un curso.
   *
   * Este método verifica si ya existe un cuestionario asociado al curso
   * especificado. Si es así, lanza un error para evitar duplicados. Luego,
   * crea el cuestionario y actualiza la referencia en el curso correspondiente.
   *
   * @param createCuestionarioInput Objeto con los datos necesarios para crear un cuestionario.
   * @param userid ID del usuario que realiza la operación.
   * @returns El cuestionario recién creado.
   */
  async create(
    createCuestionarioInput: CreateCuestionarioInput,
    userid: Types.ObjectId,
  ): Promise<Cuestionario> {
    const cursoIdAsigned = new Types.ObjectId(createCuestionarioInput.cursoId);

    // Verifica si ya existe un cuestionario para el curso proporcionado.
    const existingCuestionario = await this.cuestionarioModel.findOne({
      cursoId: cursoIdAsigned,
    });

    if (existingCuestionario) {
      throw new Error(
        `Ya existe un cuestionario asociado al curso con ID: ${cursoIdAsigned}. ` +
          `El ID del cuestionario existente es: ${existingCuestionario._id}.`,
      );
    }

    // Crea un nuevo cuestionario utilizando el método del servicio base.
    const newCuestionario = await super.create(
      { ...createCuestionarioInput, cursoId: cursoIdAsigned },
      userid,
    );

    // Actualiza el curso relacionado para establecer la referencia al nuevo cuestionario.
    const dtoUpdateCurso = {
      cuestionarioId: new Types.ObjectId(newCuestionario._id),
    } as UpdateCursoInput;

    await this.cursoService.update(cursoIdAsigned, dtoUpdateCurso, userid);

    return newCuestionario;
  }

  /**
   * Busca un cuestionario por su ID, incluyendo documentos relacionados.
   *
   * Este método utiliza un método base para obtener un cuestionario por su ID,
   * incluyendo subdocumentos relacionados, como las preguntas, sin filtrar
   * por estado (activo o inactivo).
   *
   * @param cuestionarioId ID del cuestionario a buscar.
   * @returns El cuestionario encontrado, incluyendo sus subdocumentos.
   */
  async findById(cuestionarioId: Types.ObjectId): Promise<Cuestionario> {
    const cuestionario = super.findById_WithNestedSubDocuments_ActiveOrInactive(
      cuestionarioId,
      'preguntas', // Subdocumento relacionado que se desea incluir.
      'opciones', // Subdocumento relacionado que se desea incluir.
      false, // No filtrar por estado (se incluyen cuestionarios activos e inactivos).
    );

    return cuestionario;
  }

  async findAll(pagination?: PaginationArgs): Promise<Cuestionario[]> {
    const { limit, offset } = pagination;

    const query = { deleted: false };

    const cuestionarios = await this.cuestionarioModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    console.log('cuestionarios:', cuestionarios);

    return cuestionarios;
  }
}
