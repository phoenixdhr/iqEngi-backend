import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolver_SubDocument } from 'src/common/interfaces/resolver-base-subdoc.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RespuestaPregunta } from '../entities/respuesta-pregunta.entity';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CreateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/create-respuesta-pregunta.dto';
import { UpdateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/update-respuesta-pregunta.dto';
import { RespuestaPreguntaService } from '../services/respuesta-pregunta.service';
import { RespuestaCuestionarioService } from '../services/respuesta-cuestionario.service';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class RespuestaPreguntaResolver
  implements
    IResolver_SubDocument<
      RespuestaPregunta,
      CreateRespuestaPreguntaInput,
      UpdateRespuestaPreguntaInput
    >
{
  constructor(
    private readonly preguntaService: RespuestaPreguntaService,
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService,
  ) {}

  //#region Create
  /**
   * Crea una nueva pregunta en un cuestionario específico.
   *
   * @param idRespuestaCuestionario ID del cuestionario al que se agregará la pregunta.
   * @param createRespuestaPreguntaInput Datos necesarios para crear la pregunta.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La pregunta creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaPregunta, { name: 'RespuestaPregunta_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
    @Args('createRespuestaPreguntaInput')
    createRespuestaPreguntaInput: CreateRespuestaPreguntaInput,
    @CurrentUser() user: UserRequest,
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<RespuestaPregunta> {
    const userId = new Types.ObjectId(user._id);

    return await this.preguntaService.pushToArray(
      idRespuestaCuestionario,
      userId,
      createRespuestaPreguntaInput,
      'respuestas',
      idCuestionario,
    );
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una pregunta específica dentro de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a buscar.
   * @returns La pregunta encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => RespuestaPregunta, { name: 'RespuestaPregunta' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<RespuestaPregunta> {
    return this.preguntaService.findById(idRespuestaCuestionario, idPregunta);
  }

  /**
   * Obtiene todas las preguntas de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario.
   * @returns Una lista de preguntas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaPregunta], { name: 'RespuestaPreguntas' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
  ): Promise<RespuestaPregunta[]> {
    return (
      await this.respuestaCuestionarioService.findById(idRespuestaCuestionario)
    ).respuestas;
  }
  //#endregion

  //#region Update
  /**
   * Actualiza una pregunta específica dentro de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a actualizar.
   * @param updatePreguntaInput Datos para actualizar la pregunta.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La pregunta actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaPregunta, { name: 'RespuestaPregunta_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @Args('updatePreguntaInput')
    updatePreguntaInput: UpdateRespuestaPreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaPregunta> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.preguntaService.updateInArray(
      idRespuestaCuestionario,
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
   * @param idRespuestaCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La pregunta eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaPregunta, { name: 'RespuestaPregunta_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaPregunta> {
    const idThanos = new Types.ObjectId(user._id);
    return this.preguntaService.softDelete(
      idRespuestaCuestionario,
      idPregunta,
      idThanos,
    );
  }

  /**
   * Restaura una pregunta que ha sido eliminada lógicamente.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La pregunta restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaPregunta, { name: 'RespuestaPregunta_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaPregunta> {
    const idUser = new Types.ObjectId(user._id);
    return this.preguntaService.restore(
      idRespuestaCuestionario,
      idPregunta,
      idUser,
    );
  }

  /**
   * Obtiene una lista de preguntas eliminadas lógicamente de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario.
   * @returns Una lista de preguntas eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaPregunta], {
    name: 'RespuestaPregunta_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
  ): Promise<RespuestaPregunta[]> {
    return this.preguntaService.findSoftDeleted(idRespuestaCuestionario);
  }
  //#endregion

  //#region Hard Delete
  /**
   * Elimina permanentemente una pregunta específica marcada como eliminada lógicamente.
   *
   * @param idRespuestaCuestionario ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a eliminar definitivamente.
   * @returns La pregunta eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => RespuestaPregunta, { name: 'RespuestaPregunta_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<RespuestaPregunta> {
    return this.preguntaService.pullIfDeleted(
      idRespuestaCuestionario,
      idPregunta,
    );
  }

  /**
   * Elimina permanentemente todas las preguntas marcadas como eliminadas lógicamente en un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario.
   * @returns Una lista de preguntas eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => [RespuestaPregunta], {
    name: 'RespuestaPregunta_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
  ): Promise<RespuestaPregunta[]> {
    return this.preguntaService.pullAllDeleted(idRespuestaCuestionario);
  }
  //#endregion
}
