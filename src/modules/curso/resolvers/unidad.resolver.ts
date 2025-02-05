import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolver_SubDocument } from 'src/common/interfaces/resolver-base-subdoc.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';

import { Unidad } from '../entities/unidad.entity';
import { CreateUnidadInput } from '../dtos/unidad-dtos/create-unidad.input';
import { UpdateUnidadInput } from '../dtos/unidad-dtos/update-unidad.input';
import { UnidadService } from '../services/unidad.service';
import { ModuloService } from '../services/modulo.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class UnidadResolver
  implements
    IResolver_SubDocument<Unidad, CreateUnidadInput, UpdateUnidadInput>
{
  constructor(
    private readonly unidadService: UnidadService,
    private readonly moduloService: ModuloService,
  ) {}

  //#region Create
  /**
   * Crea una nueva pregunta en un modulo específico.
   *
   * @param idModulo ID del modulo al que se agregará la pregunta.
   * @param createUnidadInput Datos necesarios para crear la pregunta.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La pregunta creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Unidad, { name: 'Unidad_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('createUnidadInput') createUnidadInput: CreateUnidadInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Unidad> {
    const userId = new Types.ObjectId(user._id);
    return this.unidadService.pushToArray(idModulo, userId, createUnidadInput);
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una pregunta específica dentro de un modulo.
   *
   * @param idModulo ID del modulo que contiene la pregunta.
   * @param idUnidad ID de la pregunta a buscar.
   * @returns La pregunta encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Unidad, { name: 'Unidad' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
  ): Promise<Unidad> {
    return this.unidadService._findById(idModulo, idUnidad);
  }

  /**
   * Obtiene todas las preguntas de un modulo.
   *
   * @param idModulo ID del modulo.
   * @returns Una lista de preguntas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Unidad], { name: 'Unidades' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
  ): Promise<Unidad[]> {
    return (await this.moduloService.findById(idModulo)).unidades;
  }
  //#endregion

  //#region Update
  /**
   * Actualiza una pregunta específica dentro de un modulo.
   *
   * @param idModulo ID del modulo que contiene la pregunta.
   * @param idUnidad ID de la pregunta a actualizar.
   * @param updateUnidadInput Datos para actualizar la pregunta.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La pregunta actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Unidad, { name: 'Unidad_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('updateUnidadInput') updateUnidadInput: UpdateUnidadInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Unidad> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.unidadService.updateInArray(
      idModulo,
      idUnidad,
      idUpdatedBy,
      updateUnidadInput,
    );
  }
  //#endregion

  //#region Soft Delete
  /**
   * Realiza una eliminación lógica de una pregunta específica en un modulo.
   *
   * @param idModulo ID del modulo que contiene la pregunta.
   * @param idUnidad ID de la pregunta a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La pregunta eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Unidad, { name: 'Unidad_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Unidad> {
    const idThanos = new Types.ObjectId(user._id);
    return this.unidadService.softDelete(idModulo, idUnidad, idThanos);
  }

  /**
   * Restaura una pregunta que ha sido eliminada lógicamente.
   *
   * @param idModulo ID del modulo que contiene la pregunta.
   * @param idUnidad ID de la pregunta a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La pregunta restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Unidad, { name: 'Unidad_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Unidad> {
    const idUser = new Types.ObjectId(user._id);
    return this.unidadService.restore(idModulo, idUnidad, idUser);
  }

  /**
   * Obtiene una lista de preguntas eliminadas lógicamente de un modulo.
   *
   * @param idModulo ID del modulo.
   * @returns Una lista de preguntas eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Unidad], { name: 'Unidad_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
  ): Promise<Unidad[]> {
    return this.unidadService.findSoftDeleted(idModulo);
  }
  //#endregion

  //#region Hard Delete
  /**
   * Elimina permanentemente una pregunta específica marcada como eliminada lógicamente.
   *
   * @param idModulo ID del modulo que contiene la pregunta.
   * @param idUnidad ID de la pregunta a eliminar definitivamente.
   * @returns La pregunta eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Unidad, { name: 'Unidad_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
  ): Promise<Unidad> {
    return this.unidadService.pullIfDeleted(idModulo, idUnidad);
  }

  /**
   * Elimina permanentemente todas las preguntas marcadas como eliminadas lógicamente en un modulo.
   *
   * @param idModulo ID del modulo.
   * @returns Una lista de preguntas eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => [Unidad], { name: 'Unidad_hardDeleteAllSoftDeleted' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
  ): Promise<Unidad[]> {
    return this.unidadService.pullAllDeleted(idModulo);
  }
  //#endregion
}
