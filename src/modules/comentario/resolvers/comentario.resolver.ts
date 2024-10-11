import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Comentario } from '../entities/comentario.entity';
import { ComentarioService } from '../services/comentario.service';
import { CreateComentarioInput } from '../dtos/create-comentario.input';
import { UpdateComentarioInput } from '../dtos/update-comentario.input';

@Resolver(() => Comentario)
export class ComentarioResolver {
  constructor(private readonly comentarioService: ComentarioService) {}

  /**
   * Crea un nuevo comentario.
   * @param createComentarioInput Datos para crear el comentario.
   * @returns El comentario creado.
   */
  @Mutation(() => Comentario)
  async createComentario(
    @Args('createComentarioInput') createComentarioInput: CreateComentarioInput,
  ): Promise<Comentario> {
    return this.comentarioService.create(createComentarioInput);
  }

  /**
   * Obtiene todos los comentarios.
   * @returns Un array de comentarios.
   */
  @Query(() => [Comentario], { name: 'comentarios' })
  async findAll(): Promise<Comentario[]> {
    return this.comentarioService.findAll();
  }

  /**
   * Obtiene un comentario por su ID.
   * @param id ID del comentario.
   * @returns El comentario encontrado.
   */
  @Query(() => Comentario, { name: 'comentario' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Comentario> {
    return this.comentarioService.findById(id);
  }

  /**
   * Obtiene los comentarios por ID del curso.
   * @param cursoId ID del curso.
   * @returns Un array de comentarios.
   */
  @Query(() => [Comentario], { name: 'comentariosPorCurso' })
  async findByCursoId(
    @Args('cursoId', { type: () => ID }) cursoId: string,
  ): Promise<Comentario[]> {
    return this.comentarioService.findByCursoId(cursoId);
  }

  /**
   * Obtiene los comentarios por ID del usuario.
   * @param usuarioId ID del usuario.
   * @returns Un array de comentarios.
   */
  @Query(() => [Comentario], { name: 'comentariosPorUsuario' })
  async findByUsuarioId(
    @Args('usuarioId', { type: () => ID }) usuarioId: string,
  ): Promise<Comentario[]> {
    return this.comentarioService.findByUsuarioId(usuarioId);
  }

  /**
   * Actualiza un comentario por su ID.
   * @param id ID del comentario a actualizar.
   * @param updateComentarioInput Datos para actualizar el comentario.
   * @returns El comentario actualizado.
   */
  @Mutation(() => Comentario)
  async updateComentario(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateComentarioInput') updateComentarioInput: UpdateComentarioInput,
  ): Promise<Comentario> {
    return this.comentarioService.update(id, updateComentarioInput);
  }

  /**
   * Elimina un comentario por su ID.
   * @param id ID del comentario a eliminar.
   * @returns El comentario eliminado.
   */
  @Mutation(() => Comentario)
  async removeComentario(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Comentario> {
    return this.comentarioService.remove(id);
  }
}
