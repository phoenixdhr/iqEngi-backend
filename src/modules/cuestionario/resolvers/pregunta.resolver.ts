import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pregunta } from '../entities/pregunta.entity';
import { UpdatePreguntaInput } from '../dtos/pregunta-dtos/update-pregunta.input';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { PreguntaService } from '../services/pregunta.service';
import { CuestionarioService } from '../services/cuestionario.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { IResolver_SubDocument } from 'src/common/interfaces/resolver-base-subdoc.interface';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class PreguntaResolver
  implements
    IResolver_SubDocument<Pregunta, CreatePreguntaInput, UpdatePreguntaInput>
{
  constructor(
    private readonly preguntaService: PreguntaService,
    private readonly cuestionarioService: CuestionarioService,
  ) {}

  //#region Create
  /**
   * Crea una nueva pregunta en un cuestionario específico.
   *
   * @param idCuestionario ID del cuestionario al que se agregará la pregunta.
   * @param createPreguntaInput Datos necesarios para crear la pregunta.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La pregunta creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Pregunta, { name: 'Pregunta_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('createPreguntaInput') createPreguntaInput: CreatePreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const userId = new Types.ObjectId(user._id);
    return this.preguntaService.pushToArray(
      idCuestionario,
      userId,
      createPreguntaInput,
    );
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una pregunta específica dentro de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a buscar.
   * @returns La pregunta encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Pregunta, { name: 'Pregunta' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Pregunta> {
    return this.preguntaService.findById(idCuestionario, idPregunta);
  }

  /**
   * Obtiene todas las preguntas de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario.
   * @returns Una lista de preguntas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Pregunta], { name: 'Preguntas' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<Pregunta[]> {
    return (await this.cuestionarioService.findById(idCuestionario)).preguntas;
  }
  //#endregion

  //#region Update
  /**
   * Actualiza una pregunta específica dentro de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a actualizar.
   * @param updatePreguntaInput Datos para actualizar la pregunta.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La pregunta actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Pregunta, { name: 'Pregunta_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('updatePreguntaInput') updatePreguntaInput: UpdatePreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.preguntaService.updateInArray(
      idCuestionario,
      idPregunta,
      idUpdatedBy,
      updatePreguntaInput,
    );
  }
  //#endregion

  //#region Soft Delete
  /**
   * Realiza una eliminación lógica de una pregunta específica en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La pregunta eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Pregunta, { name: 'Pregunta_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const idThanos = new Types.ObjectId(user._id);
    return this.preguntaService.softDelete(
      idCuestionario,
      idPregunta,
      idThanos,
    );
  }

  /**
   * Restaura una pregunta que ha sido eliminada lógicamente.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La pregunta restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Pregunta, { name: 'Pregunta_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const idUser = new Types.ObjectId(user._id);
    return this.preguntaService.restore(idCuestionario, idPregunta, idUser);
  }

  /**
   * Obtiene una lista de preguntas eliminadas lógicamente de un cuestionario.
   *
   * @param idCuestionario ID del cuestionario.
   * @returns Una lista de preguntas eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Pregunta], { name: 'Pregunta_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<Pregunta[]> {
    return this.preguntaService.findSoftDeleted(idCuestionario);
  }
  //#endregion

  //#region Hard Delete
  /**
   * Elimina permanentemente una pregunta específica marcada como eliminada lógicamente.
   *
   * @param idCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a eliminar definitivamente.
   * @returns La pregunta eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Pregunta, { name: 'Pregunta_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Pregunta> {
    return this.preguntaService.pullIfDeleted(idCuestionario, idPregunta);
  }

  /**
   * Elimina permanentemente todas las preguntas marcadas como eliminadas lógicamente en un cuestionario.
   *
   * @param idCuestionario ID del cuestionario.
   * @returns Una lista de preguntas eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => [Pregunta], { name: 'Pregunta_hardDeleteAllSoftDeleted' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<Pregunta[]> {
    return this.preguntaService.pullAllDeleted(idCuestionario);
  }
  //#endregion
}
