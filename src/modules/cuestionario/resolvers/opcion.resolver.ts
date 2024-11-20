import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IBaseResolver } from 'src/common/interfaces/base-resolver.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Opcion } from '../entities/opcion.entity';
import { UpdateOpcionInput } from '../dtos/opcion-dtos/update-opcion.input';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';
import { OpcionService } from '../services/opcion.service';
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
export class OpcionResolver
  implements IBaseResolver<Opcion, UpdateOpcionInput, CreateOpcionInput>
{
  constructor(private readonly opcionService: OpcionService) {}

  //#region create
  /**
   * Crea una nueva opción.
   *
   * @param createOpcionInput - Datos necesarios para crear la opción.
   * @param user - Usuario autenticado que realiza la creación.
   * @returns La opción creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createOpcionInput') createOpcionInput: CreateOpcionInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const userId = new Types.ObjectId(user._id);
    return this.opcionService.create(createOpcionInput, userId);
  }
  //#endregion

  //#region find
  /**
   * Obtiene todas las opciones con opciones de paginación.
   *
   * @param pagination - Opcional. Opciones de paginación.
   * @returns Un array de opciones.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Opcion], { name: 'Opcions' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Opcion[]> {
    return this.opcionService.findAll(pagination);
  }

  /**
   * Obtiene una opción específica por su ID.
   *
   * @param id - ID único de la opción.
   * @returns La opción encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Opcion, { name: 'Opcion' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Opcion> {
    return this.opcionService.findById(id);
  }
  //#endregion

  //#region update
  /**
   * Actualiza una opción existente por su ID.
   *
   * @param id - ID de la opción a actualizar.
   * @param updateOpcionInput - Datos para actualizar la opción.
   * @param user - Usuario autenticado que realiza la actualización.
   * @returns La opción actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateOpcionInput') updateOpcionInput: UpdateOpcionInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.opcionService.update(id, updateOpcionInput, idUpdatedBy);
  }
  //#endregion

  //#region delete
  /**
   * Elimina lógicamente una opción por su ID.
   *
   * @param idRemove - ID de la opción a eliminar.
   * @param user - Usuario autenticado que realiza la eliminación.
   * @returns La opción eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const idThanos = new Types.ObjectId(user._id);
    return this.opcionService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente una opción por su ID.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id - ID de la opción a eliminar permanentemente.
   * @returns La opción eliminada definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Opcion> {
    return this.opcionService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las opciones que han sido eliminadas lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de opciones eliminadas.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Opcion_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.opcionService.hardDeleteAllSoftDeleted();
  }
  //#endregion

  //#region restore
  /**
   * Obtiene todas las opciones que han sido eliminadas lógicamente.
   *
   * @param pagination - Opcional. Opciones de paginación.
   * @returns Un array de opciones eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Opcion], {
    name: 'Opcion_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Opcion[]> {
    return this.opcionService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una opción que ha sido eliminada lógicamente.
   *
   * @param idRestore - ID de la opción a restaurar.
   * @param user - Usuario autenticado que realiza la restauración.
   * @returns La opción restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const userId = new Types.ObjectId(user._id);
    return this.opcionService.restore(idRestore, userId);
  }
  //#endregion
}
