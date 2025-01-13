import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Orden } from '../entities/orden.entity';
import { UpdateOrdenInput } from '../dtos/update-orden.input';
import { CreateOrden_ListCursosInput } from '../dtos/create-orden.input';
import { OrdenService } from '../services/orden.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class OrdenResolver
  implements
    IResolverBase<Orden, CreateOrden_ListCursosInput, UpdateOrdenInput>
{
  constructor(private readonly ordenService: OrdenService) {}

  /**
   * Crea una nueva categoría.
   *
   * @param createOrden_ListCursosInput Datos necesarios para crear la categoría.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La categoría creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args({ name: 'arrayCursosIds', type: () => [ID] })
    createOrden_ListCursosInput: Types.ObjectId[],
    @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    console.log('Input recibido:', createOrden_ListCursosInput); // Verificación temporal
    const userId = new Types.ObjectId(new Types.ObjectId(user._id));
    return this.ordenService._create(createOrden_ListCursosInput, userId);
  }

  /**
   * Obtiene todas las categorías con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Orden], { name: 'Ordenes' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Orden[]> {
    return this.ordenService.findAll(pagination);
  }

  /**
   * Obtiene todas las categorías con opciones de paginación y búsqueda.
   *
   * @param usuarioId Objeto que contiene un campo "search" (texto que se usará para realizar búsquedas).
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Orden], { name: 'Ordenes_findAllByUsuarioId' })
  @RolesDec(...administradorUp)
  async findByUsuarioId(
    @Args('idUsuario', { type: () => ID }, IdPipe) idUsuario: Types.ObjectId,
    @Args() pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    return this.ordenService.findByUsuarioId(idUsuario, pagination);
  }

  @Query(() => [Orden], { name: 'Ordenes_findAllByCursoId' })
  @RolesDec(...administradorUp)
  async findByCursoId(
    @Args('idCurso', { type: () => ID }, IdPipe) idCurso: Types.ObjectId,
    @Args() pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    return this.ordenService.findByCursoId(idCurso, pagination);
  }

  /**
   * Obtiene una categoría específica por su ID.
   *
   * @param id ID único de la categoría.
   * @returns La categoría encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Orden, { name: 'Orden' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Orden> {
    return this.ordenService.findById(id);
  }

  /**
   * Actualiza una categoría existente por su ID.
   *
   * @param id ID de la categoría a actualizar.
   * @param updateCategoriaInput Datos para actualizar la categoría.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La categoría actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateCategoriaInput') updateCategoriaInput: UpdateOrdenInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.ordenService.update(id, updateCategoriaInput, idUpdatedBy);
  }

  /**
   * Elimina lógicamente una categoría por su ID.
   *
   * @param idRemove ID de la categoría a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns La categoría eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    const idThanos = new Types.ObjectId(user._id);
    return this.ordenService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente una categoría por su ID.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id ID de la categoría a eliminar permanentemente.
   * @returns La categoría eliminada definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Orden> {
    return this.ordenService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las categorías que han sido eliminadas lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de categorías eliminadas.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Ordenes_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.ordenService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todas las categorías que han sido eliminadas lógicamente.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Orden], {
    name: 'Ordenes_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    return this.ordenService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una categoría que ha sido eliminada lógicamente.
   *
   * @param idRestore ID de la categoría a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La categoría restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    const userId = new Types.ObjectId(user._id);
    return this.ordenService.restore(idRestore, userId);
  }
}
