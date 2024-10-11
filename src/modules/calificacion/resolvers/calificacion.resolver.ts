// calificacion.resolver.ts

import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { Calificacion } from '../entities/calificacion.entity';
import { CalificacionService } from '../services/calificacion.service';
import { CreateCalificacionInput } from '../dtos/create-calificacion.input';
import { UpdateCalificacionInput } from '../dtos/update-calificacion.input';

@Resolver(() => Calificacion)
export class CalificacionResolver {
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
  ): Promise<Calificacion> {
    return this.calificacionService.create(createCalificacionInput);
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
    return this.calificacionService.findOneById(id);
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
  ): Promise<Calificacion> {
    return this.calificacionService.update(id, updateCalificacionInput);
  }

  /**
   * Elimina una calificación por su ID.
   * @param id ID de la calificación a eliminar.
   * @returns La calificación eliminada.
   */
  @Mutation(() => Calificacion)
  async removeCalificacion(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Calificacion> {
    return this.calificacionService.remove(id);
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
