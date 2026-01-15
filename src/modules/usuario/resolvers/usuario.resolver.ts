// usuario.resolver.ts

import { UseGuards } from '@nestjs/common';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';

// Importaciones de GraphQL
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsuarioService } from '../services/usuario.service';
import { UpdateUsuarioInput } from '../dtos/usuarios-dtos/update-usuario.input';
import { UpdateRolesInput } from '../dtos/usuarios-dtos/update-roles.input';
import { PaginationArgs, RolesInput, SearchTextArgs } from 'src/common/dtos';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { DeletedCountOutput } from '../dtos/usuarios-dtos/deleted-count.output';
import { CreateUsuarioInput } from '../dtos/usuarios-dtos/create-usuario.input';
import SearchField from 'src/common/clases/search-field.class';
import SearchFieldArgs from 'src/common/dtos/search-field.args';
import { Types } from 'mongoose';
import { IsPublic } from 'src/modules/auth/decorators/public.decorator';

/**
 * Resolver para manejar las operaciones de Usuario.
 * Incluye operaciones como creación, actualización, eliminación y consultas de usuarios.
 *
 * @Guard : JwtGqlAuthGuard, RolesGuard
 */
@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => UsuarioOutput)
// implements
//   IBaseResolver<UsuarioOutput, CreateUsuarioInput, UpdateUsuarioInput>
export class UsuarioResolver {
  constructor(private readonly usuarioService: UsuarioService) { }

  /**
   * Crea un nuevo usuario.
   * @param createUsuarioInput Datos para crear el usuario.
   * @returns El usuario creado.
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createUsuarioInput') createUsuarioInput: CreateUsuarioInput,
  ): Promise<UsuarioOutput> {
    return this.usuarioService.create(createUsuarioInput);
  }

  /**
   * Obtiene todos los usuarios con opciones de paginación y búsqueda.
   * @param pagination Opcional. Opciones de paginación.
   * @param search Opcional. Opciones de búsqueda.
   * @returns Un array de usuarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [UsuarioOutput], {
    name: 'usuarios',
  })
  @RolesDec(...administradorUp)
  async findAll(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
    @Args({ type: () => SearchTextArgs, nullable: true })
    search?: SearchTextArgs,
  ): Promise<UsuarioOutput[]> {
    return this.usuarioService.findAll(pagination, search);
  }

  /**
   * Obtiene todos los usuarios con opciones de paginación y búsqueda.
   * @param searchArgs Objeto que contiene un campo "serch" (texto que se usara para realizar busquedas).
   * @param pagination Opciones de paginación.
   * @returns Un array de usuarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [UsuarioOutput], { name: 'usuarios_findAllByFirstname' })
  @RolesDec(...administradorUp)
  async findAllByFirstname(
    @Args() searchArgs: SearchTextArgs,
    @Args() pagination?: PaginationArgs,
  ): Promise<UsuarioOutput[]> {
    return this.usuarioService.findAllByFirstname(searchArgs, pagination);
  }

  /**
   * Obtiene todos los usuarios con opciones de paginación y búsqueda.
   * @param searchArgs Objeto que contiene un campo "serch" (texto que se usara para realizar busquedas).
   * @param searchField Objeto que contiene un campo de búsqueda, debe ser una Key del documento por ejemplo "lastName".
   * @param pagination Opciones de paginación.
   * @returns Un array de usuarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [UsuarioOutput], { name: 'usuarios_findAllBy' })
  @RolesDec(...administradorUp)
  async findAllBy(
    @Args() searchArgs: SearchTextArgs,
    @Args() searchField?: SearchFieldArgs,
    @Args() pagination?: PaginationArgs,
  ): Promise<UsuarioOutput[]> {
    if (!searchField.field) {
      return this.usuarioService.findAllByFirstname(searchArgs, pagination);
    }

    const searchField2 = {
      field: searchField.field,
    } as unknown as SearchField<UsuarioOutput>;

    return this.usuarioService.findAllBy(searchArgs, searchField2, pagination);
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario.
   * @returns El usuario encontrado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => UsuarioOutput, { name: 'usuario' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId, // Aplica el Pipe aquí
  ): Promise<UsuarioOutput> {
    return this.usuarioService.findById(id);
  }

  /**
   * Obtiene una lista de usuarios filtrados por roles específicos.
   * @param roles Objeto que contiene los roles a filtrar en un array.
   * @returns Un array de usuarios que tienen alguno de los roles especificados.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [UsuarioOutput], {
    name: 'usuarios_findByRol',
    description:
      'Obtiene una lista de usuarios filtrados por roles específicos.',
  })
  @RolesDec(...administradorUp)
  async findByRol(
    @Args('objetoRoles', { type: () => RolesInput }) roles: RolesInput,
  ): Promise<UsuarioOutput[]> {
    return this.usuarioService.findByRol(roles);
  }

  /**
   * Obtiene un usuario por su email.
   * @param email Email del usuario.
   * @returns El usuario encontrado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => UsuarioOutput, { name: 'usuario_findByEmail' })
  // @RolesDec(...administradorUp)
  @IsPublic()
  async findByEmail(@Args('email') email: string): Promise<UsuarioOutput> {
    return this.usuarioService.findByEmail(email);
  }

  /**
   * Actualiza los datos de un usuario autenticado (excluyendo la contraseña).
   *
   * @param updateUsuarioInput Datos para actualizar el usuario.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns El usuario actualizado.
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_update_onlyUser' })
  async update(
    @Args('updateUsuarioInput') updateUsuarioInput: UpdateUsuarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const id = new Types.ObjectId(user._id);
    return this.usuarioService.update(id, updateUsuarioInput, id);
  }

  /**
   * Actualiza los datos de un usuario por su ID (excluyendo la contraseña).
   * @param id ID del usuario a actualizar.
   * @param updateUsuarioInput Datos para actualizar el usuario.
   * @returns El usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_update_onlyAdmin' })
  @RolesDec(...administradorUp)
  async updateUsuariofromAdmin(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateUsuarioInput') updateUsuarioInput: UpdateUsuarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.usuarioService.update(id, updateUsuarioInput, idUpdatedBy);
  }

  /**
   * Actualiza los roles de un usuario.
   * Solo los usuarios con rol ADMINISTRADOR o SUPERADMIN pueden realizar esta operación.
   *
   * @param id ID del usuario a actualizar.
   * @param updateRolesInput Nuevos roles a asignar.
   * @returns El usuario actualizado con los nuevos roles.
   * @throws NotFoundException si el usuario no existe.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_updateRoles' })
  @RolesDec(...administradorUp)
  async updateRoles(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateRolesInput') updateRolesInput: UpdateRolesInput,
  ): Promise<UsuarioOutput> {
    return this.usuarioService.updateRoles(id, updateRolesInput.roles);
  }

  /**
   * Elimina (desactiva) un usuario específico por su ID.
   * Solo los usuarios con rol ADMINISTRADOR pueden realizar esta operación.
   *
   * @param idRemove ID del usuario a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns El usuario eliminado.
   * @throws NotFoundException si el usuario no existe.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId, // Aplica el Pipe aquí
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const idThanos = new Types.ObjectId(user._id);
    return this.usuarioService.softDelete(idRemove, idThanos);
  }

  /**
   * Obtiene una lista de usuarios que han sido marcados como eliminados.
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de usuarios eliminados.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [UsuarioOutput], {
    name: 'usuarios_findSoftDeleted',
    description: 'Obtiene una lista de usuarios eliminados.',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<UsuarioOutput[]> {
    return this.usuarioService.findSoftDeleted(pagination);
  }

  /**
   * Restaura un usuario eliminado.
   * @param idRestore ID del usuario a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns El usuario restaurado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId, // Aplica el Pipe aquí
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const userId = new Types.ObjectId(user._id);
    return this.usuarioService.restore(idRestore, userId);
  }

  /**
   * Elimina permanentemente un usuario por su ID.
   * @param id ID del usuario a eliminar.
   * @returns El usuario eliminado.
   * @throws NotFoundException si el usuario no existe.
   *
   * @Roles: SUPER
   */
  @Mutation(() => UsuarioOutput, { name: 'usuario_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<UsuarioOutput> {
    return this.usuarioService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todos los usuarios marcados como eliminados.
   * @returns Un objeto con el número de usuarios eliminados.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'usuarios_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.usuarioService.hardDeleteAllSoftDeleted();
  }
}
