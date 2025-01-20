import { Injectable } from '@nestjs/common';
import { Curso } from '../entities/curso.entity';
import { CreateCursoInput } from '../dtos/curso-dtos/create-curso.input';
import { BaseService } from 'src/common/services/base.service';
import { UpdateCursoInput } from '../dtos/curso-dtos/update-curso.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationArgs, SearchTextArgs } from 'src/common/dtos';
import SearchField from 'src/common/clases/search-field.class';

@Injectable()
export class CursoService extends BaseService<
  Curso,
  UpdateCursoInput,
  CreateCursoInput
> {
  constructor(
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,
  ) {
    super(cursoModel);
  }

  /**
   * Crea un nuevo curso.
   *
   * Verifica si ya existe un curso con el mismo título antes de crearlo.
   * Si el curso ya existe, lanza un error.
   *
   * @param createCursoInput Datos necesarios para crear el curso.
   * @param userid ID del usuario que está creando el curso.
   * @returns El curso creado.
   */
  async create(
    createCursoInput: CreateCursoInput,
    userid: Types.ObjectId,
  ): Promise<Curso> {
    const titulo = createCursoInput.courseTitle;

    if (titulo) {
      const curso = await this.cursoModel
        .findOne({ courseTitle: titulo })
        .exec();

      if (curso) {
        throw new Error(`El curso ya existe con id ${curso.id}`);
      }
    }

    return super.create(createCursoInput, userid);
  }

  /**
   * Busca cursos cuyo título coincida con un texto proporcionado.
   *
   * Utiliza un campo de búsqueda específico (`titulo`) para realizar la consulta.
   * Admite opciones de paginación para limitar la cantidad de resultados.
   *
   * @param searchArgs Argumentos de búsqueda que contienen el texto a buscar.
   * @param pagination Opcional. Configuración para paginación de resultados.
   * @returns Un array de cursos que coinciden con los criterios de búsqueda.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  async findAllByTitle(
    searchArgs: SearchTextArgs,
    pagination?: PaginationArgs,
  ): Promise<Curso[]> {
    const searchField: SearchField<Curso> = new SearchField();
    searchField.field = 'courseTitle';

    return super.findAllBy(searchArgs, searchField, pagination) as Promise<
      Curso[]
    >;
  }

  async findAll(pagination?: PaginationArgs): Promise<Curso[]> {
    const { limit, offset } = pagination;

    const query = { deleted: false };

    const cursos = await this.cursoModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return cursos;
  }
}
