import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Comentario } from '../entities/comentario.entity';
import { ComentarioService } from '../services/comentario.service';
import { UpdateComentarioInput } from '../dtos/update-comentario.input';

import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { Types } from 'mongoose';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { CreateComentario_userInput } from '../dtos/create-comentario-user.input';
import { CreateComentarioInput } from '../dtos/create-comentario.input';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';

/**
 * Resolver para manejar las operaciones relacionadas con los comentarios.
 * Implementa las funcionalidades básicas definidas en `IBaseResolver`.
 */
@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => Comentario)
export class ComentarioResolver
  implements
    IResolverBase<Comentario, CreateComentario_userInput, UpdateComentarioInput>
{
  constructor(private readonly comentarioService: ComentarioService) {}

  //#region Métodos Generales IBaseResolver

  /**
   * Crea un nuevo comentario asociado a un curso.
   *
   * @param createComentarioUserInput Datos necesarios para crear el comentario.
   * @param user Usuario autenticado que realiza la creación.
   * @returns El comentario creado.
   *
   * @Roles: Requiere autenticación (cualquier usuario autenticado puede realizar esta operación).
   */
  @Mutation(() => Comentario, { name: 'Comentario_create' })
  async create(
    @Args('createComentarioInput')
    createComentarioUserInput: CreateComentario_userInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Comentario> {
    const userId = new Types.ObjectId(user._id);

    const createComentarioInput = {
      ...createComentarioUserInput,
      usuarioId: userId,
    } as CreateComentarioInput;

    return this.comentarioService.create(createComentarioInput, userId);
  }

  /**
   * Obtiene todos los comentarios con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de comentarios.
   *
   * @Roles: Requiere autenticación (cualquier usuario autenticado puede realizar esta operación).
   */
  @Query(() => [Comentario], { name: 'Comentarios' })
  async findAll(@Args() pagination?: PaginationArgs): Promise<Comentario[]> {
    return this.comentarioService.findAll(pagination);
  }

  /**
   * Obtiene un comentario específico por su ID.
   *
   * @param id ID único del comentario.
   * @returns El comentario encontrado.
   *
   * @Roles: Requiere roles de ADMINISTRADOR o SUPERADMIN.
   */
  @Query(() => Comentario, { name: 'Comentario' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Comentario> {
    return this.comentarioService.findById(id);
  }

  /**
   * Actualiza un comentario existente por su ID.
   *
   * @param id ID del comentario a actualizar.
   * @param updateComentarioInput Datos para actualizar el comentario.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns El comentario actualizado.
   *
   * @Roles: Requiere autenticación (cualquier usuario autenticado puede actualizar sus propios comentarios).
   */
  @Mutation(() => Comentario, { name: 'Comentario_update' })
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateComentarioInput')
    updateComentarioInput: UpdateComentarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Comentario> {
    const idUpdatedBy = new Types.ObjectId(user._id);

    return this.comentarioService.update(
      id,
      updateComentarioInput,
      idUpdatedBy,
    );
  }

  /**
   * Elimina lógicamente un comentario por su ID (soft delete).
   *
   * @param idRemove ID del comentario a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns El comentario eliminado lógicamente.
   *
   * @Roles: Requiere autenticación (cualquier usuario autenticado puede eliminar sus propios comentarios).
   */
  @Mutation(() => Comentario, { name: 'Comentario_softDelete' })
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Comentario> {
    const idThanos = new Types.ObjectId(user._id);
    return this.comentarioService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente un comentario por su ID (hard delete).
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id ID del comentario a eliminar permanentemente.
   * @returns El comentario eliminado definitivamente.
   *
   * @Roles: SUPERADMIN.
   */
  @Mutation(() => Comentario, { name: 'Comentario_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Comentario> {
    return this.comentarioService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todos los comentarios que han sido eliminados lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de comentarios eliminados.
   *
   * @Roles: SUPERADMIN.
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Comentario_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.comentarioService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todos los comentarios que han sido eliminados lógicamente.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de comentarios eliminados lógicamente.
   *
   * @Roles: Requiere roles de ADMINISTRADOR o SUPERADMIN.
   */
  @Query(() => [Comentario], {
    name: 'Comentario_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Comentario[]> {
    return this.comentarioService.findSoftDeleted(pagination);
  }

  /**
   * Restaura un comentario que ha sido eliminado lógicamente.
   *
   * @param idRestore ID del comentario a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns El comentario restaurado.
   *
   * @Roles: Requiere roles de ADMINISTRADOR o SUPERADMIN.
   */
  @Mutation(() => Comentario, { name: 'Comentario_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Comentario> {
    const userId = new Types.ObjectId(user._id);
    return this.comentarioService.restore(idRestore, userId);
  }

  //#region Consultas personalizadas

  /**
   * Obtiene todos los comentarios asociados a un curso específico.
   *
   * @param cursoId ID del curso.
   * @returns Un array de comentarios del curso.
   *
   * @Roles: No requiere roles específicos (público).
   */
  @Query(() => [Comentario], { name: 'Comentarios_PorCurso' })
  async findByCurso(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
  ): Promise<Comentario[]> {
    return this.comentarioService.findByCursoId(cursoId);
  }

  /**
   * Obtiene todos los comentarios realizados por un usuario específico.
   *
   * @param usuarioId ID del usuario.
   * @returns Un array de comentarios del usuario.
   *
   * @Roles: Requiere roles de ADMINISTRADOR o SUPERADMIN.
   */
  @Query(() => [Comentario], { name: 'Comentarios_PorUsuario' })
  @RolesDec(...administradorUp)
  async findByUsuario(
    @Args('usuarioId', { type: () => ID }, IdPipe) usuarioId: Types.ObjectId,
  ): Promise<Comentario[]> {
    return this.comentarioService.findByUsuarioId(usuarioId);
  }
}
