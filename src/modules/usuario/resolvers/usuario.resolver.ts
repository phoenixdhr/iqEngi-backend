// usuario.resolver.ts

import { UseGuards } from '@nestjs/common';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';

// Importaciones de GraphQL
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioInput } from '../dtos/usuarios-dtos/create-usuario.input';
import { UpdateUsuarioInput } from '../dtos/usuarios-dtos/update-usuario.input';
import { PaginationArgs, RolesInput, SearchArgs } from 'src/common/dtos';
import { administradorUp } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { IsPublic } from 'src/modules/auth/decorators/public.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

/**
 * Resolver para manejar las operaciones de Usuario.
 * Incluye operaciones como creación, actualización, eliminación y consultas de usuarios.
 * @Guard : JwtGqlAuthGuard, RolesGuard
 */
@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => UsuarioOutput)
export class UsuarioResolver {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Crea un nuevo usuario.
   * @param createUsuarioInput Datos para crear el usuario.
   * @returns El usuario creado.
   */
  @Mutation(() => UsuarioOutput)
  @IsPublic()
  async createUsuario(
    @Args('createUsuarioInput') createUsuarioInput: CreateUsuarioInput,
  ): Promise<UsuarioOutput> {
    return this.usuarioService.create(createUsuarioInput);
  }

  /**
   * Obtiene todos los usuarios con opciones de paginación y búsqueda.
   * Opcionalmente, puede filtrar por roles específicos.
   * @param roles Opcional. Roles para filtrar los usuarios.
   * @param pagination Opcional. Opciones de paginación.
   * @param search Opcional. Opciones de búsqueda.
   * @returns Un array de usuarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */

  @Query(() => [UsuarioOutput], {
    name: 'usuarios',
    description:
      'Obtiene una lista de usuarios, opcionalmente filtrados por roles.',
  })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('roles', {
      type: () => RolesInput,
      nullable: true,
      description: 'Filtrar usuarios por roles específicos.',
    })
    roles?: RolesInput,
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
    @Args({ type: () => SearchArgs, nullable: true })
    search?: SearchArgs,
  ): Promise<UsuarioOutput[]> {
    if (!roles || !roles.roles) {
      return this.usuarioService.findAll(pagination, search);
    }
    return this.usuarioService.findByRol(roles);
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario.
   * @returns El usuario encontrado.
   * @throws NotFoundException si el usuario no existe.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */

  @Query(() => UsuarioOutput, { name: 'usuario' })
  @RolesDec(...administradorUp)
  async findOne(
    @Args('id', { type: () => ID }, IdPipe) id: string, // Aplica el Pipe aquí
  ): Promise<UsuarioOutput> {
    return this.usuarioService.findById(id);
  }

  /**
   * Actualiza los datos de un usuario autenticado (excluyendo la contraseña).
   *
   * @param updateUsuarioInput Datos para actualizar el usuario.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns El usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   */
  @Mutation(() => UsuarioOutput)
  async updateUsuario(
    @Args('updateUsuarioInput') updateUsuarioInput: UpdateUsuarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const id = user._id;
    return this.usuarioService.update(id, updateUsuarioInput, id);
  }

  /**
   * Actualiza los datos de un usuario por su ID (excluyendo la contraseña).
   * @param id ID del usuario a actualizar.
   * @param updateUsuarioInput Datos para actualizar el usuario.
   * @returns El usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   */
  @Mutation(() => UsuarioOutput)
  @RolesDec(...administradorUp)
  async updateUsuariofromAdmin(
    @Args('id', { type: () => ID }, IdPipe) id: string,
    @Args('updateUsuarioInput') updateUsuarioInput: UpdateUsuarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const idUpdatedBy = user._id;
    return this.usuarioService.update(id, updateUsuarioInput, idUpdatedBy);
  }

  // /**
  //  * Actualiza la contraseña del usuario autenticado.
  //  *
  //  * @param updatePasswordInput Datos para actualizar la contraseña.
  //  * @param user Usuario autenticado que realiza la actualización.
  //  * @returns El usuario.
  //  * @throws NotFoundException si el usuario no existe.
  //  * @throws ConflictException si la contraseña antigua es incorrecta.
  //  */
  // @Mutation(() => UsuarioOutput)
  // async updatePassword(
  //   @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
  //   @CurrentUser() user: UserRequest,
  // ): Promise<UsuarioOutput> {
  //   const id = user._id;
  //   return this.usuarioService.updatePassword(id, updatePasswordInput);
  // }

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
  @Mutation(() => UsuarioOutput)
  @RolesDec(...administradorUp)
  async removeUsuario(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: string, // Aplica el Pipe aquí
    @CurrentUser() user: UserRequest,
  ): Promise<UsuarioOutput> {
    const idThanos = user._id;
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
    name: 'usuariosEliminados',
    description: 'Obtiene una lista de usuarios eliminados.',
  })
  @RolesDec(...administradorUp)
  async findDeletedUsers(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<UsuarioOutput[]> {
    return this.usuarioService.findSoftDeletedUsers(pagination);
  }
}
