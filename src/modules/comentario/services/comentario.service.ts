import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comentario } from '../entities/comentario.entity';
import { CreateComentarioInput } from '../dtos/create-comentario.input';
import { UpdateComentarioInput } from '../dtos/update-comentario.input';
import { BaseService } from 'src/common/services/base.service';

/**
 * Servicio para manejar las operaciones relacionadas con los comentarios.
 * Extiende las funcionalidades básicas proporcionadas por `BaseService`.
 */
@Injectable()
export class ComentarioService extends BaseService<
  Comentario,
  UpdateComentarioInput,
  CreateComentarioInput
> {
  /**
   * Constructor del servicio de comentarios.
   * Inyecta el modelo de Mongoose para la entidad `Comentario` y lo pasa al constructor de la clase padre `BaseService`.
   *
   * @param comentarioModel Modelo de Mongoose para la entidad `Comentario`.
   */
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>,
  ) {
    super(comentarioModel);
  }

  //#region Métodos Generales IBaseResolver modificados

  /**
   * Crea un nuevo comentario.
   * @param createComentarioInput Datos para crear el comentario.
   * @param userid ID del usuario que crea el comentario.
   * @returns El comentario creado.
   * @throws NotFoundException si el curso al que se asocia el comentario no existe.
   */
  async create(
    createComentarioInput: CreateComentarioInput,
    userid: Types.ObjectId,
  ): Promise<Comentario> {
    const idCurso = new Types.ObjectId(createComentarioInput.cursoId);

    // Verifica si el curso al que se asocia el comentario existe.
    const curso = await this.findByCursoId(idCurso);

    if (!curso) {
      throw new NotFoundException(
        'El curso al que se intenta comentar no existe',
      );
    }

    // Crea el comentario utilizando el método heredado de `BaseService`.
    return super.create({ ...createComentarioInput, cursoId: idCurso }, userid);
  }

  // #region Métodos personalizadas

  /**
   * Obtiene los comentarios asociados a un curso específico por su ID.
   * @param cursoId ID del curso.
   * @returns Un array de comentarios relacionados con el curso.
   */
  async findByCursoId(cursoId: Types.ObjectId): Promise<Comentario[]> {
    return this.comentarioModel.find({ cursoId }).exec();
  }

  /**
   * Obtiene los comentarios realizados por un usuario específico por su ID.
   * @param usuarioId ID del usuario.
   * @returns Un array de comentarios realizados por el usuario.
   */
  async findByUsuarioId(usuarioId: Types.ObjectId): Promise<Comentario[]> {
    return this.comentarioModel.find({ usuarioId }).exec();
  }
}
