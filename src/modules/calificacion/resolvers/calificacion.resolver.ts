// calificacion.resolver.ts

import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { Calificacion } from '../entities/calificacion.entity';
import { CalificacionService } from '../services/calificacion.service';
import { CreateCalificacionInput } from '../dtos/create-calificacion.input';
import { UpdateCalificacionInput } from '../dtos/update-calificacion.input';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { IBaseResolver } from 'src/common/interfaces/base-resolver.interface';

@Resolver(() => Calificacion)
export class CalificacionResolver
  // implements
  //   IBaseResolver<
  //     Calificacion,
  //     CreateCalificacionInput,
  //     UpdateCalificacionInput
  //   >
{
  constructor(private readonly calificacionService: CalificacionService) {}

  /**
   * Crea una nueva calificación.
   * @param createCalificacionInput Datos para crear la calificación.
   * @returns La calificación creada.
   */
  @Mutation(() => Calificacion)
  async createCalificacion(
    @Args('createCalificacionInput')
    createCalificacionInput: CreateCalificacionInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Calificacion> {
    const userId = user._id;
    return this.calificacionService.create(createCalificacionInput, userId);
  }

  /**
   * Obtiene todas las calificaciones.
   * @returns Un array de calificaciones.
   */
  @Query(() => [Calificacion], { name: 'calificaciones' })
  async findAll(): Promise<Calificacion[]> {
    return this.calificacionService.findAll();
  }

  /**
   * Obtiene una calificación por su ID.
   * @param id ID de la calificación.
   * @returns La calificación encontrada.
   */
  @Query(() => Calificacion, { name: 'calificacion' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Calificacion> {
    return this.calificacionService.findById(id);
  }

  /**
   * Obtiene las calificaciones de un curso.
   * @param cursoId ID del curso.
   * @returns Un array de calificaciones del curso.
   */
  @Query(() => [Calificacion], { name: 'calificacionesPorCurso' })
  async findByCurso(
    @Args('cursoId', { type: () => ID }) cursoId: string,
  ): Promise<Calificacion[]> {
    return this.calificacionService.findByCursoId(cursoId);
  }

  /**
   * Obtiene las calificaciones de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Un array de calificaciones del usuario.
   */
  @Query(() => [Calificacion], { name: 'calificacionesPorUsuario' })
  async findByUsuario(
    @Args('usuarioId', { type: () => ID }) usuarioId: string,
  ): Promise<Calificacion[]> {
    return this.calificacionService.findByUsuarioId(usuarioId);
  }

  /**
   * Actualiza una calificación por su ID.
   * @param id ID de la calificación a actualizar.
   * @param updateCalificacionInput Datos para actualizar la calificación.
   * @returns La calificación actualizada.
   */
  @Mutation(() => Calificacion)
  async updateCalificacion(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCalificacionInput')
    updateCalificacionInput: UpdateCalificacionInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Calificacion> {
    const idUpdatedBy = user._id;

    return this.calificacionService.update(
      id,
      updateCalificacionInput,
      idUpdatedBy,
    );
  }

  /**
   * Elimina una calificación por su ID.
   * @param id ID de la calificación a eliminar.
   * @returns La calificación eliminada.
   */
  @Mutation(() => Calificacion)
  async removeCalificacion(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: UserRequest,
  ): Promise<Calificacion> {
    const idThanos = user._id;
    return this.calificacionService.softDelete(id, idThanos);
  }

  /**
   * Calcula el promedio de calificaciones de un curso.
   * @param cursoId ID del curso.
   * @returns El promedio de calificaciones.
   */
  @Query(() => Float, { name: 'promedioCalificaciones' })
  async calculatePromedio(
    @Args('cursoId', { type: () => ID }) cursoId: string,
  ): Promise<number> {
    return this.calificacionService.calculatePromedio(cursoId);
  }
}
