import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { UpdateRespuestaCuestionarioInput } from '../dtos/respuesta-cuestionario-dtos/update-respuesta-cuestionario.dto';
import { CreateRespuestaCuestionarioInput } from '../dtos/respuesta-cuestionario-dtos/create-respuesta-cuestionario.dto';
import { RespuestaCuestionario } from '../entities/respuesta-cuestionario.entity';
import { RespuestaCuestionarioService } from '../services/respuesta-cuestionario.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';

/**
 * Resolver encargado de gestionar las respuestas de cuestionarios.
 * Se aplican guardas de autenticación y roles para restringir el acceso a métodos específicos.
 */
@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class RespuestaCuestionarioResolver
  implements
    IResolverBase<
      RespuestaCuestionario,
      UpdateRespuestaCuestionarioInput,
      CreateRespuestaCuestionarioInput
    >
{
  constructor(
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService,
  ) {}

  /**
   * Crea una nueva respuesta asociada a un cuestionario.
   *
   * @param createRespuestaCuestionarioInput Datos necesarios para la creación de la respuesta.
   * @param currentUser Información del usuario autenticado que realiza la operación.
   * @returns La respuesta creada, asociada al cuestionario.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_create',
  })
  @RolesDec(...administradorUp)
  async create(
    @Args('createRespuestaCuestionarioInput')
    createRespuestaCuestionarioInput: CreateRespuestaCuestionarioInput,
    @CurrentUser() currentUser: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const creatorUserId = new Types.ObjectId(currentUser._id);
    return this.respuestaCuestionarioService.create(
      createRespuestaCuestionarioInput,
      creatorUserId,
    );
  }

  /**
   * Obtiene una lista de respuestas de cuestionarios, con soporte opcional de paginación.
   *
   * @param paginationArgs (Opcional) Parámetros de paginación.
   * @returns Una lista de respuestas de cuestionarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], { name: 'RespuestaCuestionarios' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args() paginationArgs?: PaginationArgs,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findAll(paginationArgs);
  }

  /**
   * Busca una respuesta específica mediante su ID único.
   *
   * @param respuestaCuestionarioId ID de la respuesta a cuestionario a buscar.
   * @returns La respuesta correspondiente al ID proporcionado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => RespuestaCuestionario, { name: 'RespuestaCuestionario' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('respuestaCuestionarioId', { type: () => ID }, IdPipe)
    respuestaCuestionarioId: Types.ObjectId,
  ): Promise<RespuestaCuestionario> {
    return this.respuestaCuestionarioService.findById(respuestaCuestionarioId);
  }

  /**
   * Busca respuestas asociadas a un curso específico.
   *
   * @param cursoId ID del curso.
   * @returns Lista de respuestas asociadas al curso indicado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], {
    name: 'RespuestaCuestionario_byCursoId',
  })
  @RolesDec(...administradorUp)
  async findByCursoId(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findByCursoId(cursoId);
  }

  /**
   * Busca respuestas asociadas a un usuario específico.
   *
   * @param usuarioId ID del usuario.
   * @returns Lista de respuestas asociadas al usuario.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], {
    name: 'RespuestaCuestionario_byUsuarioId',
  })
  @RolesDec(...administradorUp)
  async findByUsuarioId(
    @Args('usuarioId', { type: () => ID }, IdPipe) usuarioId: Types.ObjectId,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findByUsuarioId(usuarioId);
  }

  /**
   * Actualiza los datos de una respuesta existente.
   *
   * @param respuestaCuestionarioUpdateId ID de la respuesta a actualizar.
   * @param updateRespuestaCuestionarioInput Datos actualizados de la respuesta.
   * @param currentUser Información del usuario autenticado.
   * @returns La respuesta actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_update',
  })
  @RolesDec(...administradorUp)
  async update(
    @Args('respuestaCuestionarioUpdateId', { type: () => ID }, IdPipe)
    respuestaCuestionarioUpdateId: Types.ObjectId,
    @Args('updateRespuestaCuestionarioInput')
    updateRespuestaCuestionarioInput: UpdateRespuestaCuestionarioInput,
    @CurrentUser() currentUser: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const updaterUserId = new Types.ObjectId(currentUser._id);
    return this.respuestaCuestionarioService.update(
      respuestaCuestionarioUpdateId,
      updateRespuestaCuestionarioInput,
      updaterUserId,
    );
  }

  /**
   * Elimina lógicamente una respuesta de cuestionario.
   *
   * @param respuestaCuestionarioId ID de la respuesta a eliminar.
   * @param currentUser Información del usuario autenticado que realiza la operación.
   * @returns La respuesta que ha sido marcada como eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_softDelete',
  })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('respuestaCuestionarioId', { type: () => ID }, IdPipe)
    respuestaCuestionarioId: Types.ObjectId,
    @CurrentUser() currentUser: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const deleterUserId = new Types.ObjectId(currentUser._id);
    return this.respuestaCuestionarioService.softDelete(
      respuestaCuestionarioId,
      deleterUserId,
    );
  }

  /**
   * Elimina permanentemente una respuesta de cuestionario.
   *
   * @param respuestaCuestionarioId ID de la respuesta a eliminar permanentemente.
   * @returns La respuesta eliminada de forma permanente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_hardDelete',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('respuestaCuestionarioId', { type: () => ID }, IdPipe)
    respuestaCuestionarioId: Types.ObjectId,
  ): Promise<RespuestaCuestionario> {
    return this.respuestaCuestionarioService.hardDelete(
      respuestaCuestionarioId,
    );
  }

  /**
   * Restaura una respuesta eliminada lógicamente.
   *
   * @param respuestaCuestionarioId ID de la respuesta a restaurar.
   * @param currentUser Información del usuario autenticado que realiza la restauración.
   * @returns La respuesta que ha sido restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_restore',
  })
  @RolesDec(...administradorUp)
  async restore(
    @Args('respuestaCuestionarioId', { type: () => ID }, IdPipe)
    respuestaCuestionarioId: Types.ObjectId,
    @CurrentUser() currentUser: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const restorerUserId = new Types.ObjectId(currentUser._id);
    return this.respuestaCuestionarioService.restore(
      respuestaCuestionarioId,
      restorerUserId,
    );
  }

  /**
   * Elimina permanentemente todas las respuestas que fueron eliminadas lógicamente.
   *
   * @returns Número de respuestas que se han eliminado de manera permanente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'RespuestaCuestionario_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.respuestaCuestionarioService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene una lista de respuestas que fueron eliminadas lógicamente, con soporte de paginación opcional.
   *
   * @param paginationArgs (Opcional) Parámetros de paginación.
   * @returns Lista de respuestas marcadas como eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], {
    name: 'RespuestaCuestionario_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    paginationArgs?: PaginationArgs,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findSoftDeleted(paginationArgs);
  }
}
