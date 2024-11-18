// calificacion.resolver.ts

import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { Calificacion } from '../entities/calificacion.entity';
import { CalificacionService } from '../services/calificacion.service';
import { CreateCalificacionInput } from '../dtos/create-calificacion.input';
import { CreateCalificacionUserInput } from '../dtos/create-calificacion-user.input';

import { UpdateCalificacionInput } from '../dtos/update-calificacion.input';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { IBaseResolver } from 'src/common/interfaces/base-resolver.interface';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { PaginationArgs } from 'src/common/dtos/pagination.args';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { deletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Types } from 'mongoose';

/**
 * Resolver para manejar las operaciones de Calificación.
 * Incluye operaciones como creación, actualización, eliminación y consultas de calificaciones.
 *
 * @Guard : JwtGqlAuthGuard, RolesGuard
 */
@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => Calificacion)
export class CalificacionResolver
  implements
    IBaseResolver<
      Calificacion,
      CreateCalificacionUserInput,
      UpdateCalificacionInput
    >
{
  constructor(private readonly calificacionService: CalificacionService) {}

  //#region Métodos Generales IBaseResolver
  /**
   * Crea una nueva calificación de un curso, por un usuario.
   *
   * @param CreateCalificacionUserInput Datos necesarios para crear la calificación.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La calificación creada.
   *
   */
  @Mutation(() => Calificacion, { name: 'Calificacion_create' })
  async create(
    @Args('createCalificacionInput')
    CreateCalificacionUserInput: CreateCalificacionUserInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Calificacion> {
    const userId = new Types.ObjectId(user._id);
    const CreateCalificacionInput = {
      ...CreateCalificacionUserInput,
      usuarioId: userId,
    } as CreateCalificacionInput;
    return this.calificacionService.create(CreateCalificacionInput, user._id);
  }

  /**
   * Obtiene todas las calificaciones con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de calificaciones.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Calificacion], { name: 'Calificaciones' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Calificacion[]> {
    return this.calificacionService.findAll(pagination);
  }

  /**
   * Obtiene una calificación específica por su ID.
   *
   * @param id ID único de la calificación.
   * @returns La calificación encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Calificacion, { name: 'Calificacion' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: string,
  ): Promise<Calificacion> {
    return this.calificacionService.findById(id);
  }

  /**
   * Actualiza una calificación existente por su ID.
   * NO ES NECESARIO IMPLEMENTAR ESTE METODO DE ACUERDO A LA LOGICA DE LA APLICACION
   * ESTE METODO SE PUEDE ELIMINAR
   *
   * @param id ID de la calificación a actualizar.
   * @param updateCalificacionInput Datos para actualizar la calificación.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La calificación actualizada.
   *
   */
  @Mutation(() => Calificacion, { name: 'Calificacion_update' })
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: string,
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
   * Elimina lógicamente una calificación por su ID (soft delete).
   *
   * @param idRemove ID de la calificación a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns La calificación eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Calificacion, { name: 'Calificacion_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: string,
    @CurrentUser() user: UserRequest,
  ): Promise<Calificacion> {
    const idThanos = user._id;
    return this.calificacionService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente una calificación por su ID (hard delete).
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id ID de la calificación a eliminar permanentemente.
   * @returns La calificación eliminada definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Calificacion, { name: 'Calificacion_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: string,
  ): Promise<Calificacion> {
    return this.calificacionService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las calificaciones que han sido eliminadas lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de calificaciones eliminadas.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => deletedCountOutput, {
    name: 'Calificacion_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<deletedCountOutput> {
    return this.calificacionService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todas las calificaciones que han sido eliminadas lógicamente.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de calificaciones eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Calificacion], {
    name: 'Calificacion_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Calificacion[]> {
    return this.calificacionService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una calificación que ha sido eliminada lógicamente.
   *
   * @param idRestore ID de la calificación a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La calificación restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Calificacion, { name: 'Calificacion_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: string, // Aplica el Pipe aquí
    @CurrentUser() user: UserRequest,
  ): Promise<Calificacion> {
    const userId = user._id;
    return this.calificacionService.restore(idRestore, userId);
  }

  /**
   * Calcula el promedio de calificaciones de un curso específico.
   *
   * @param cursoId ID del curso cuyo promedio se desea calcular.
   * @returns El promedio de calificaciones del curso.
   *
   * @Roles: No requiere roles específicos.
   */
  @Query(() => Float, { name: 'Calificacion_promedioCalificaciones' })
  async calculatePromedio(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: string,
  ): Promise<number> {
    return this.calificacionService.calculatePromedio(cursoId);
  }

  //#region Consultas personalizadas
  /**
   * Obtiene todas las calificaciones asociadas a un curso específico.
   *
   * @param cursoId ID del curso.
   * @returns Un array de calificaciones del curso.
   *
   * @Roles: No requiere roles específicos.
   */
  @Query(() => [Calificacion], { name: 'Calificaciones_PorCurso' })
  async findByCurso(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: string,
  ): Promise<Calificacion[]> {
    return this.calificacionService.findByCursoId(cursoId);
  }

  /**
   * Obtiene todas las calificaciones realizadas por un usuario específico.
   *
   * @param usuarioId ID del usuario.
   * @returns Un array de calificaciones del usuario.
   *
   * @Roles: No requiere roles específicos.
   */
  @Query(() => [Calificacion], { name: 'Calificaciones_PorUsuario' })
  async findByUsuario(
    @Args('usuarioId', { type: () => ID }, IdPipe) usuarioId: string,
  ): Promise<Calificacion[]> {
    return this.calificacionService.findByUsuarioId(usuarioId);
  }
}
