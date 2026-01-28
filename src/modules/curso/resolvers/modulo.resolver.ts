import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';

import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Modulo } from '../entities/modulo.entity';
import { UpdateModuloInput } from '../dtos/modulo-dtos/update-modulo.input';
import { CreateModuloInput } from '../dtos/modulo-dtos/create-modulo.input';
import { ModuloService } from '../services/modulo.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class ModuloResolver
  implements IResolverBase<Modulo, CreateModuloInput, UpdateModuloInput> {
  constructor(private readonly moduloService: ModuloService) { }

  @Mutation(() => Modulo, { name: 'Modulo_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createModuloInput')
    createModuloInput: CreateModuloInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const userId = new Types.ObjectId(user._id);
    return this.moduloService._create(createModuloInput, userId);
  }

  /**
   * Obtiene todos los cuestionarios, con soporte opcional para paginación.
   *
   * @param pagination Opciones de paginación (opcional).
   * @returns Una lista de cuestionarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Modulo], { name: 'Modulos' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Modulo[]> {
    //return this.ModuloService.findAll(pagination);
    const cuestionarios = await this.moduloService.findAll(pagination);
    // Verifica que los datos lleguen correctamente
    return cuestionarios;
  }

  /**
   * Obtiene un cuestionario por su ID único.
   *
   * @param id ID del cuestionario a buscar.
   * @returns El cuestionario encontrado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Modulo, { name: 'Modulo' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Modulo> {
    return this.moduloService.findById(id);
  }

  /**
   * Obtiene un cuestionario por su ID único.
   *
   * @param id ID del cuestionario a buscar.
   * @returns El cuestionario encontrado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */

  @Query(() => [Modulo], { name: 'Modulo_findByCursoId' })
  @RolesDec(...administradorUp)
  async findByCursoId(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
  ): Promise<Modulo[]> {
    return this.moduloService.findByCursoId(cursoId);
  }

  /**
   * Actualiza los datos de un cuestionario existente.
   *
   * @param id ID del cuestionario a actualizar.
   * @param updateCuestionarioInput Datos actualizados del cuestionario.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns El cuestionario actualizado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateCuestionarioInput')
    updateCuestionarioInput: UpdateModuloInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.moduloService.update(id, updateCuestionarioInput, idUpdatedBy);
  }

  /**
   * Realiza una eliminación lógica de un cuestionario, marcándolo como eliminado.
   *
   * @param idRemove ID del cuestionario a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns El cuestionario eliminado lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const idThanos = new Types.ObjectId(user._id);
    return this.moduloService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente un cuestionario por su ID.
   *
   * Este método solo está disponible para usuarios con el rol SUPERADMIN.
   *
   * @param id ID del cuestionario a eliminar definitivamente.
   * @returns El cuestionario eliminado de forma permanente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Modulo> {
    return this.moduloService.hardDelete(id);
  }

  /**
   * Elimina de forma permanente todos los cuestionarios marcados como eliminados lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con el rol SUPERADMIN.
   *
   * @returns Un objeto con el conteo de los cuestionarios eliminados.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Modulo_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.moduloService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene una lista de cuestionarios eliminados lógicamente.
   *
   * @param pagination Opciones de paginación (opcional).
   * @returns Una lista de cuestionarios marcados como eliminados.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Modulo], {
    name: 'Modulo_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Modulo[]> {
    return this.moduloService.findSoftDeleted(pagination);
  }

  /**
   * Restaura un cuestionario previamente eliminado lógicamente.
   *
   * @param idRestore ID del cuestionario a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns El cuestionario restaurado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Modulo, { name: 'Modulo_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Modulo> {
    const userId = new Types.ObjectId(user._id);
    return this.moduloService.restore(idRestore, userId);
  }
}
