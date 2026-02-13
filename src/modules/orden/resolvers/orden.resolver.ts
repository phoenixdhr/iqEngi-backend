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
  IResolverBase<Orden, CreateOrden_ListCursosInput, UpdateOrdenInput> {
  constructor(private readonly ordenService: OrdenService) { }

  /**
   * Crea una nueva orden.
   *
   * Este método crea una nueva orden asociada a una lista de cursos. Se valida
   * que todos los cursos existan y no estén eliminados.
   *
   * @param createOrden_ListCursosInput Lista de IDs de los cursos para la orden.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La orden recién creada.
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
    const userId = new Types.ObjectId(new Types.ObjectId(user._id));
    return this.ordenService._create(createOrden_ListCursosInput, userId);
  }

  /**
   * Obtiene todas las órdenes con opciones de paginación.
   *
   * Este método permite listar todas las órdenes activas, paginando los resultados.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de órdenes.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Orden], { name: 'Ordenes' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Orden[]> {
    return this.ordenService.findAll(pagination);
  }

  /**
   * Obtiene las órdenes asociadas a un usuario.
   *
   * Este método permite listar todas las órdenes asociadas a un usuario
   * específico, con opciones de paginación.
   *
   * @param idUsuario ID del usuario.
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de órdenes del usuario.
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

  /**
   * Obtiene las órdenes asociadas a un curso.
   *
   * Este método permite listar todas las órdenes que contienen un curso
   * específico, con opciones de paginación.
   *
   * @param idCurso ID del curso.
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de órdenes que incluyen el curso.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Orden], { name: 'Ordenes_findAllByCursoId' })
  @RolesDec(...administradorUp)
  async findByCursoId(
    @Args('idCurso', { type: () => ID }, IdPipe) idCurso: Types.ObjectId,
    @Args() pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    return this.ordenService.findByCursoId(idCurso, pagination);
  }

  /**
   * Obtiene una orden específica por su ID.
   *
   * @param id ID único de la orden.
   * @returns La orden encontrada.
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
   * Actualiza una orden existente por su ID.
   *
   * @param id ID de la orden a actualizar.
   * @param updateOrdenInput Datos para actualizar la orden.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La orden actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateOrdenInput') updateOrdenInput: UpdateOrdenInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.ordenService.update(id, updateOrdenInput, idUpdatedBy);
  }

  /**
   * Elimina lógicamente una orden por su ID.
   *
   * Este método marca la orden como eliminada sin eliminarla físicamente.
   *
   * @param idRemove ID de la orden a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns La orden eliminada lógicamente.
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
   * Elimina permanentemente una orden por su ID.
   *
   * Este método elimina completamente la orden de la base de datos.
   *
   * @param id ID de la orden a eliminar permanentemente.
   * @returns La orden eliminada definitivamente.
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
   * Elimina permanentemente todas las órdenes eliminadas lógicamente.
   *
   * @returns Un objeto que contiene el conteo de órdenes eliminadas.
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
   * Obtiene todas las órdenes que han sido eliminadas lógicamente.
   *
   * Este método permite listar las órdenes eliminadas lógicamente,
   * con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de órdenes eliminadas lógicamente.
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
   * Restaura una orden que ha sido eliminada lógicamente.
   *
   * @param idRestore ID de la orden a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La orden restaurada.
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
