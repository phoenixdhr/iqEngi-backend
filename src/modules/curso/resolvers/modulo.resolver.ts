import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolver_SubDocument } from 'src/common/interfaces/resolver-base-subdoc.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Modulo } from '../entities/modulo.entity';
import { CreateModuloInput } from '../dtos/modulo-dtos/create-modulo.input';
import { UpdateModuloInput } from '../dtos/modulo-dtos/update-modulo.input';
import { ModuloService } from '../services/modulo.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { CursoService } from '../services/curso.service';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class ModuloResolver
  implements
    IResolver_SubDocument<Modulo, CreateModuloInput, UpdateModuloInput>
{
  constructor(
    private readonly moduloService: ModuloService,
    private readonly cursoService: CursoService,
  ) {}

  //#region Create
  /**
   * Crea una nueva modulo en un curso específico.
   *
   * @param idCurso ID del curso al que se agregará la modulo.
   * @param createModuloInput Datos necesarios para crear la modulo.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La modulo creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('createModuloInput') createModuloInput: CreateModuloInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const userId = new Types.ObjectId(user._id);
    console.log('000');
    return this.moduloService.pushToArray(idCurso, userId, createModuloInput);
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una modulo específica dentro de un curso.
   *
   * @param idCurso ID del curso que contiene la modulo.
   * @param idModulo ID de la modulo a buscar.
   * @returns La modulo encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Modulo, { name: 'Modulo' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('idModulo', { type: () => ID }, IdPipe) idModulo: Types.ObjectId,
  ): Promise<Modulo> {
    return this.moduloService._findById(idCurso, idModulo);
  }

  /**
   * Obtiene todas las modulos de un curso.
   *
   * @param idCurso ID del curso.
   * @returns Una lista de modulos.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Modulo], { name: 'Modulos' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
  ): Promise<Modulo[]> {
    return this.moduloService.findAll(idCurso);
  }
  //#endregion

  //#region Update
  /**
   * Actualiza una modulo específica dentro de un curso.
   *
   * @param idCurso ID del curso que contiene la modulo.
   * @param idModulo ID de la modulo a actualizar.
   * @param updateModuloInput Datos para actualizar la modulo.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La modulo actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('idModulo', { type: () => ID }, IdPipe) idModulo: Types.ObjectId,
    @Args('updateModuloInput') updateModuloInput: UpdateModuloInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.moduloService.updateInArray(
      idCurso,
      idModulo,
      idUpdatedBy,
      updateModuloInput,
    );
  }
  //#endregion

  //#region Soft Delete
  /**
   * Realiza una eliminación lógica de una modulo específica en un curso.
   *
   * @param idCurso ID del curso que contiene la modulo.
   * @param idModulo ID de la modulo a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La modulo eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('idModulo', { type: () => ID }, IdPipe) idModulo: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const idThanos = new Types.ObjectId(user._id);
    return this.moduloService.softDelete(idCurso, idModulo, idThanos);
  }

  /**
   * Restaura una modulo que ha sido eliminada lógicamente.
   *
   * @param idCurso ID del curso que contiene la modulo.
   * @param idModulo ID de la modulo a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La modulo restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('idModulo', { type: () => ID }, IdPipe) idModulo: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const idUser = new Types.ObjectId(user._id);
    return this.moduloService.restore(idCurso, idModulo, idUser);
  }

  /**
   * Obtiene una lista de modulos eliminadas lógicamente de un curso.
   *
   * @param idCurso ID del curso.
   * @returns Una lista de modulos eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Modulo], { name: 'Modulo_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
  ): Promise<Modulo[]> {
    return this.moduloService.findSoftDeleted(idCurso);
  }
  //#endregion

  //#region Hard Delete
  /**
   * Elimina permanentemente una modulo específica marcada como eliminada lógicamente.
   *
   * @param idCurso ID del curso que contiene la modulo.
   * @param idModulo ID de la modulo a eliminar definitivamente.
   * @returns La modulo eliminada permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('idModulo', { type: () => ID }, IdPipe) idModulo: Types.ObjectId,
  ): Promise<Modulo> {
    return this.moduloService.pullIfDeleted(idCurso, idModulo);
  }

  /**
   * Elimina permanentemente todas las modulos marcadas como eliminadas lógicamente en un curso.
   *
   * @param idCurso ID del curso.
   * @returns Una lista de modulos eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => [Modulo], { name: 'Modulo_hardDeleteAllSoftDeleted' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
  ): Promise<Modulo[]> {
    return this.moduloService.pullAllDeleted(idCurso);
  }
  //#endregion
}
