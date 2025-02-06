import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolver_NestedSubDocument } from 'src/common/interfaces/resolver-base- nested-subdocument.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Material } from '../entities/material.entity';
import { CreateMaterialInput } from '../dtos/material-dtos/create-material.input';
import { UpdateMaterialInput } from '../dtos/material-dtos/update-material.input';
import { MaterialService } from '../services/material.service';
import { UnidadService } from '../services/unidad.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { Types } from 'mongoose';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class MaterialResolver
  implements
    IResolver_NestedSubDocument<
      Material,
      CreateMaterialInput,
      UpdateMaterialInput
    >
{
  constructor(
    private readonly materialService: MaterialService,
    private readonly unidadService: UnidadService,
  ) {}

  //#region Create
  /**
   * Crea una nueva opción dentro de una pregunta específica en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta donde se agregará la opción.
   * @param createOpcionInput Datos para crear la nueva opción.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La opción creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Material, { name: 'Material_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('createOpcionInput') createOpcionInput: CreateMaterialInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Material> {
    const createdBy = new Types.ObjectId(user._id);
    return this.materialService.pushToNestedArray(
      idModulo,
      idUnidad,
      createdBy,
      createOpcionInput,
    );
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una opción específica dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene la opción.
   * @param idMaterial ID de la opción a buscar.
   * @returns La opción encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Material, { name: 'Material' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('idMaterial', { type: () => ID }, IdPipe) idMaterial: Types.ObjectId,
  ): Promise<Material> {
    return this.materialService.findById(idModulo, idUnidad, idMaterial);
  }

  /**
   * Obtiene todas las opciones de una pregunta específica en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene las opciones.
   * @returns Una lista de opciones.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Material], { name: 'Materiales' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
  ): Promise<Material[]> {
    const unidad = await this.unidadService._findById(idModulo, idUnidad);

    return unidad.materiales || [];
  }

  /**
   * Obtiene todas las opciones eliminadas lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene las opciones.
   * @returns Una lista de opciones eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Material], { name: 'Material_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
  ): Promise<Material[]> {
    return this.materialService.findSoftDeleted(idModulo, idUnidad);
  }
  //#endregion

  //#region Update
  /**
   * Actualiza una opción específica dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene la opción.
   * @param idMaterial ID de la opción a actualizar.
   * @param updateOpcionInput Datos para actualizar la opción.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La opción actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Material, { name: 'Material_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('idMaterial', { type: () => ID }, IdPipe) idMaterial: Types.ObjectId,
    @Args('updateOpcionInput') updateOpcionInput: UpdateMaterialInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Material> {
    const idUser = new Types.ObjectId(user._id);
    return this.materialService.updateInNestedArray(
      idModulo,
      idUnidad,
      idMaterial,
      idUser,
      updateOpcionInput,
    );
  }
  //#endregion

  //#region Soft Delete
  /**
   * Realiza una eliminación lógica de una opción dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene la opción.
   * @param idMaterial ID de la opción a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La opción eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Material, { name: 'Material_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('idMaterial', { type: () => ID }, IdPipe) idMaterial: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Material> {
    const idUser = new Types.ObjectId(user._id);
    return this.materialService.softDelete(
      idModulo,
      idUnidad,
      idMaterial,
      idUser,
    );
  }

  /**
   * Restaura una opción eliminada lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene la opción.
   * @param idMaterial ID de la opción a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La opción restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Material, { name: 'Material_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('idMaterial', { type: () => ID }, IdPipe) idMaterial: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Material> {
    const idUser = new Types.ObjectId(user._id);
    return this.materialService.restore(idModulo, idUnidad, idMaterial, idUser);
  }
  //#endregion

  //#region Hard Delete
  /**
   * Elimina permanentemente una opción eliminada lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario que contiene la pregunta.
   * @param idUnidad ID de la pregunta que contiene la opción.
   * @param idMaterial ID de la opción a eliminar permanentemente.
   * @returns La opción eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Material, { name: 'Material_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
    @Args('idMaterial', { type: () => ID }, IdPipe) idMaterial: Types.ObjectId,
  ): Promise<Material> {
    return this.materialService.pullIfDeleted(idModulo, idUnidad, idMaterial);
  }

  /**
   * Elimina permanentemente todas las opciones eliminadas lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idModulo ID del cuestionario.
   * @param idUnidad ID de la pregunta.
   * @returns Una lista de opciones eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => [Material], { name: 'Material_hardDeleteAllSoftDeleted' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idModulo', { type: () => ID }, IdPipe)
    idModulo: Types.ObjectId,
    @Args('idUnidad', { type: () => ID }, IdPipe) idUnidad: Types.ObjectId,
  ): Promise<Material[]> {
    return this.materialService.pullAllDeleted(idModulo, idUnidad);
  }
  //#endregion
}
