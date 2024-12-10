import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Opcion } from '../entities/opcion.entity';
import { OpcionService } from '../services/opcion.service';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';
import { UpdateOpcionInput } from '../dtos/opcion-dtos/update-opcion.input';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { PreguntaService } from '../services/pregunta.service';
import { IResolver_NestedSubDocument } from 'src/common/interfaces/resolver-base- nested-subdocument.interface';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class OpcionResolver
  implements
    IResolver_NestedSubDocument<Opcion, CreateOpcionInput, UpdateOpcionInput>
{
  constructor(
    private readonly opcionService: OpcionService,
    private readonly preguntaService: PreguntaService,
  ) {}

  //#region Create
  /**
   * Crea una nueva opción dentro de una pregunta específica en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta donde se agregará la opción.
   * @param createOpcionInput Datos para crear la nueva opción.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La opción creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('createOpcionInput') createOpcionInput: CreateOpcionInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const createdBy = new Types.ObjectId(user._id);
    return this.opcionService.pushToNestedArray(
      idCuestionario,
      idPregunta,
      createdBy,
      createOpcionInput,
    );
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una opción específica dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a buscar.
   * @returns La opción encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Opcion, { name: 'Opcion' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('idOpcion', { type: () => ID }, IdPipe) idOpcion: Types.ObjectId,
  ): Promise<Opcion> {
    return this.opcionService.findById(idCuestionario, idPregunta, idOpcion);
  }

  /**
   * Obtiene todas las opciones de una pregunta específica en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene las opciones.
   * @returns Una lista de opciones.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Opcion], { name: 'Opciones' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Opcion[]> {
    const pregunta = await this.preguntaService.findById(
      idCuestionario,
      idPregunta,
    );
    return pregunta.opciones || [];
  }

  /**
   * Obtiene todas las opciones eliminadas lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene las opciones.
   * @returns Una lista de opciones eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Opcion], { name: 'Opcion_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Opcion[]> {
    return this.opcionService.findSoftDeleted(idCuestionario, idPregunta);
  }
  //#endregion

  //#region Update
  /**
   * Actualiza una opción específica dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a actualizar.
   * @param updateOpcionInput Datos para actualizar la opción.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La opción actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('idOpcion', { type: () => ID }, IdPipe) idOpcion: Types.ObjectId,
    @Args('updateOpcionInput') updateOpcionInput: UpdateOpcionInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const idUser = new Types.ObjectId(user._id);
    return this.opcionService.updateInNestedArray(
      idCuestionario,
      idPregunta,
      idOpcion,
      idUser,
      updateOpcionInput,
    );
  }
  //#endregion

  //#region Soft Delete
  /**
   * Realiza una eliminación lógica de una opción dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La opción eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('idOpcion', { type: () => ID }, IdPipe) idOpcion: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const idUser = new Types.ObjectId(user._id);
    return this.opcionService.softDelete(
      idCuestionario,
      idPregunta,
      idOpcion,
      idUser,
    );
  }

  /**
   * Restaura una opción eliminada lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La opción restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('idOpcion', { type: () => ID }, IdPipe) idOpcion: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Opcion> {
    const idUser = new Types.ObjectId(user._id);
    return this.opcionService.restore(
      idCuestionario,
      idPregunta,
      idOpcion,
      idUser,
    );
  }
  //#endregion

  //#region Hard Delete
  /**
   * Elimina permanentemente una opción eliminada lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta que contiene la opción.
   * @param idOpcion ID de la opción a eliminar permanentemente.
   * @returns La opción eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Opcion, { name: 'Opcion_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('idOpcion', { type: () => ID }, IdPipe) idOpcion: Types.ObjectId,
  ): Promise<Opcion> {
    return this.opcionService.pullIfDeleted(
      idCuestionario,
      idPregunta,
      idOpcion,
    );
  }

  /**
   * Elimina permanentemente todas las opciones eliminadas lógicamente dentro de una pregunta en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario.
   * @param idPregunta ID de la pregunta.
   * @returns Una lista de opciones eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => [Opcion], { name: 'Opcion_hardDeleteAllSoftDeleted' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Opcion[]> {
    return this.opcionService.pullAllDeleted(idCuestionario, idPregunta);
  }
  //#endregion
}
