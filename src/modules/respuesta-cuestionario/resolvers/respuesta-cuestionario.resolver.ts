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
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';

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
   * Crea una nueva respuesta a un cuestionario y la asocia a un curso específico.
   *
   * @param createCuestionarioInput Objeto con los datos necesarios para la creación.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La respuesta al cuestionario creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_create',
  })
  @RolesDec(...administradorUp)
  async create(
    @Args('createCuestionarioInput')
    createCuestionarioInput: CreateRespuestaCuestionarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const userId = new Types.ObjectId(user._id);
    return this.respuestaCuestionarioService.create(
      createCuestionarioInput,
      userId,
    );
  }

  /**
   * Obtiene una lista de todas las respuestas a cuestionarios, con soporte opcional para paginación.
   *
   * @param pagination Parámetros de paginación (opcional).
   * @returns Una lista de respuestas a cuestionarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], { name: 'RespuestaCuestionarios' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args() pagination?: PaginationArgs,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findAll(pagination);
  }

  /**
   * Obtiene una respuesta a un cuestionario por su ID único.
   *
   * @param id ID de la respuesta a cuestionario a buscar.
   * @returns La respuesta al cuestionario correspondiente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => RespuestaCuestionario, { name: 'RespuestaCuestionario' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<RespuestaCuestionario> {
    return this.respuestaCuestionarioService.findById(id);
  }

  /**
   * Busca respuestas a cuestionarios asociadas a un curso específico.
   *
   * @param cursoId ID del curso para el cual se quieren obtener respuestas.
   * @returns Una lista de respuestas asociadas al curso.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], {
    name: 'RespuestaCuestionario_byCursoID',
  })
  @RolesDec(...administradorUp)
  async findByCursoId(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findByCursoId(cursoId);
  }

  /**
   * Busca respuestas a cuestionarios asociadas a un usuario específico.
   *
   * @param usuarioId ID del usuario para el cual se quieren obtener respuestas.
   * @returns Una lista de respuestas asociadas al usuario.
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
   * Actualiza una respuesta a un cuestionario existente.
   *
   * @param id ID de la respuesta a cuestionario a actualizar.
   * @param updateCuestionarioInput Datos actualizados de la respuesta.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La respuesta al cuestionario actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_update',
  })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateCuestionarioInput')
    updateCuestionarioInput: UpdateRespuestaCuestionarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.respuestaCuestionarioService.update(
      id,
      updateCuestionarioInput,
      idUpdatedBy,
    );
  }

  /**
   * Marca una respuesta a cuestionario como eliminada lógicamente.
   *
   * @param idRemove ID de la respuesta a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La respuesta al cuestionario marcada como eliminada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_softDelete',
  })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const idThanos = new Types.ObjectId(user._id);
    return this.respuestaCuestionarioService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente una respuesta a cuestionario.
   *
   * @param id ID de la respuesta a eliminar permanentemente.
   * @returns La respuesta al cuestionario eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_hardDelete',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<RespuestaCuestionario> {
    return this.respuestaCuestionarioService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las respuestas marcadas como eliminadas lógicamente.
   *
   * @returns Conteo de respuestas eliminadas permanentemente.
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
   * Obtiene respuestas a cuestionarios que fueron eliminadas lógicamente.
   *
   * @param pagination Parámetros de paginación (opcional).
   * @returns Una lista de respuestas eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaCuestionario], {
    name: 'RespuestaCuestionario_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<RespuestaCuestionario[]> {
    return this.respuestaCuestionarioService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una respuesta a cuestionario eliminada lógicamente.
   *
   * @param idRestore ID de la respuesta a restaurar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La respuesta al cuestionario restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaCuestionario, {
    name: 'RespuestaCuestionario_restore',
  })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaCuestionario> {
    const userId = new Types.ObjectId(user._id);
    return this.respuestaCuestionarioService.restore(idRestore, userId);
  }
}
