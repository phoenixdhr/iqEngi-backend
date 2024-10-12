// usuario.resolver.ts

import { UseGuards } from '@nestjs/common';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';

// Importaciones de GraphQL
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioInput } from '../dtos/usuarios-dtos/create-usuario.input';
import { UpdateUsuarioInput } from '../dtos/usuarios-dtos/update-usuario.input';
import { UpdatePasswordInput } from '../dtos/usuarios-dtos/update-password';
import { PaginationArgs, RolesInput, SearchArgs } from 'src/common/dtos';
import { RolEnum } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';

/**
 * Resolver para manejar las operaciones de Usuario.
 */
@Resolver(() => UsuarioOutput)
export class UsuarioResolver {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Crea un nuevo usuario.
   * @param createUsuarioInput Datos para crear el usuario.
   * @returns El usuario creado.
   *
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => UsuarioOutput)
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
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
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN, EDITOR, INSTRUCTOR
   */
  @Query(() => [UsuarioOutput], {
    name: 'usuarios',
    description:
      'Obtiene una lista de usuarios, opcionalmente filtrados por roles.',
  })
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
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
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN, EDITOR, INSTRUCTOR, EL MISMO USUARIO
   */
  @Query(() => UsuarioOutput, { name: 'usuario' })
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
  async findOne(
    @Args('id', { type: () => ID }, IdPipe) id: string, // Aplica el Pipe aquí
  ): Promise<UsuarioOutput> {
    return this.usuarioService.findById(id);
  }

  /**
   * Actualiza los datos de un usuario por su ID (excluyendo la contraseña).
   * @param id ID del usuario a actualizar.
   * @param updateUsuarioInput Datos para actualizar el usuario.
   * @returns El usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   *
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN, EL MISMO USUARIO
   */
  @Mutation(() => UsuarioOutput)
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
  async updateUsuario(
    @Args('id', { type: () => ID }, IdPipe) id: string, // Aplica el Pipe aquí
    @Args('updateUsuarioInput') updateUsuarioInput: UpdateUsuarioInput,
  ): Promise<UsuarioOutput> {
    return this.usuarioService.update(id, updateUsuarioInput);
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param id ID del usuario.
   * @param updatePasswordInput Datos para actualizar la contraseña.
   * @returns El usuario con la contraseña actualizada.
   * @throws NotFoundException si el usuario no existe.
   * @throws ConflictException si la contraseña antigua es incorrecta.
   *
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN, EL MISMO USUARIO
   */
  @Mutation(() => UsuarioOutput)
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
  async updatePassword(
    @Args('id', { type: () => ID }, IdPipe) id: string, // Aplica el Pipe aquí
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
  ): Promise<UsuarioOutput> {
    return this.usuarioService.updatePassword(id, updatePasswordInput);
  }

  /**
   * Elimina (desactiva) un usuario por su ID.
   * @param idRemove ID del usuario a eliminar.
   * @param idThanos ID del usuario que realiza la eliminación.
   * @returns El usuario eliminado.
   * @throws NotFoundException si el usuario no existe.
   *
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => UsuarioOutput)
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
  async removeUsuario(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: string, // Aplica el Pipe aquí
    @Args('idThanos', { type: () => ID }, IdPipe) idThanos: string, // Aplica el Pipe aquí
  ): Promise<UsuarioOutput> {
    return this.usuarioService.remove(idRemove, idThanos);
  }

  /**
   * Obtiene todos los usuarios marcados como DELETED.
   * @param pagination Opciones de paginación.
   * @returns Un array de usuarios eliminados.
   *
   * @Guard: JwtGqlAuthGuard
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [UsuarioOutput], {
    name: 'usuariosEliminados',
    description: 'Obtiene una lista de usuarios eliminados.',
  })
  // @UseGuards(JwtGqlAuthGuard) // Descomenta esta línea cuando implementes los guards
  async findDeletedUsers(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<UsuarioOutput[]> {
    return this.usuarioService.findDeletedUsers(pagination);
  }
}
