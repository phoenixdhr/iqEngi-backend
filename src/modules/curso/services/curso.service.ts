import { Injectable, NotFoundException } from '@nestjs/common';
import { Curso } from '../entities/curso.entity';
import { CreateCursoInput } from '../dtos/curso-dtos/create-curso.input';
import { BaseService } from 'src/common/services/base.service';
import { UpdateCursoInput } from '../dtos/curso-dtos/update-curso.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationArgs, SearchTextArgs } from 'src/common/dtos';
import SearchField from 'src/common/clases/search-field.class';
import { generateSlug } from 'src/common/utils/generate-slug';

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
   * Recupera un curso por su ID con las categorías populadas.
   *
   * @param id - El ID del curso a buscar.
   * @returns El curso encontrado con las categorías populadas.
   * @throws NotFoundException si no se encuentra el curso.
   */
  async findById(id: Types.ObjectId): Promise<Curso> {
    const curso = await this.cursoModel
      .findOne({ _id: id, deleted: false })
      .populate({
        path: 'categorias',
        match: { deleted: false },
      })
      .exec();

    if (!curso) {
      throw new NotFoundException(`Curso con ID "${id}" no encontrado`);
    }

    return curso as unknown as Curso;
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

    const slug = generateSlug(titulo);
    createCursoInput.slug = slug;

    return super.create(createCursoInput, userid);
  }

  /**
   * Actualiza un curso existente y devuelve el curso con las categorías populadas.
   *
   * @param id - El ID del curso a actualizar.
   * @param updateCursoInput - Datos para actualizar el curso.
   * @param userId - ID del usuario que realiza la actualización.
   * @returns El curso actualizado con las categorías populadas.
   */
  async update(
    id: Types.ObjectId,
    updateCursoInput: UpdateCursoInput,
    userId: Types.ObjectId,
  ): Promise<Curso> {
    const titulo = updateCursoInput.courseTitle;

    if (titulo) {
      const slug = generateSlug(titulo);
      updateCursoInput.slug = slug;
    }

    // Realizar la actualización
    await super.update(id, updateCursoInput, userId);

    // Retornar el curso con las categorías populadas
    return this.findById(id);
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

  /**
   * Agrega una o más categorías a un curso existente.
   *
   * @param cursoId - ID del curso al que se agregarán las categorías.
   * @param categoriaIds - Array de IDs de categorías a agregar.
   * @param userId - ID del usuario que realiza la operación.
   * @returns El curso actualizado con las categorías populadas.
   * @throws NotFoundException si el curso no existe.
   */
  async addCategorias(
    cursoId: Types.ObjectId,
    categoriaIds: Types.ObjectId[],
    userId: Types.ObjectId,
  ): Promise<Curso> {
    const curso = await this.cursoModel.findOne({
      _id: cursoId,
      deleted: false,
    });

    if (!curso) {
      throw new NotFoundException(`Curso con ID "${cursoId}" no encontrado`);
    }

    // Usar $addToSet para evitar duplicados
    await this.cursoModel.findByIdAndUpdate(
      cursoId,
      {
        $addToSet: { categorias: { $each: categoriaIds } },
        $set: { updatedBy: userId },
      },
      { new: true },
    );

    return this.findById(cursoId);
  }

  /**
   * Elimina una o más categorías de un curso existente.
   *
   * @param cursoId - ID del curso del que se eliminarán las categorías.
   * @param categoriaIds - Array de IDs de categorías a eliminar.
   * @param userId - ID del usuario que realiza la operación.
   * @returns El curso actualizado con las categorías populadas.
   * @throws NotFoundException si el curso no existe.
   */
  async removeCategorias(
    cursoId: Types.ObjectId,
    categoriaIds: Types.ObjectId[],
    userId: Types.ObjectId,
  ): Promise<Curso> {
    const curso = await this.cursoModel.findOne({
      _id: cursoId,
      deleted: false,
    });

    if (!curso) {
      throw new NotFoundException(`Curso con ID "${cursoId}" no encontrado`);
    }

    // Usar $pull para eliminar las categorías
    await this.cursoModel.findByIdAndUpdate(
      cursoId,
      {
        $pull: { categorias: { $in: categoriaIds } },
        $set: { updatedBy: userId },
      },
      { new: true },
    );

    return this.findById(cursoId);
  }
}
