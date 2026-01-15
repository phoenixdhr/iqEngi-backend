import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Categoria } from '../entities/categoria.entity';
import { CategoriaService } from '../services/categoria.service';

import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { PaginationArgs, SearchTextArgs } from 'src/common/dtos';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { Types } from 'mongoose';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { UpdateCategoriaInput } from '../dtos/update-categoria.input';
import { CreateCategoriaInput } from '../dtos/create-categoria.input';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';
import { IsPublic } from 'src/modules/auth/decorators/public.decorator';

@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => Categoria)
export class CategoriaResolver
  implements
  IResolverBase<Categoria, CreateCategoriaInput, UpdateCategoriaInput> {
  constructor(private readonly categoriaService: CategoriaService) { }

  /**
   * Crea una nueva categoría.
   *
   * @param createCategoriaInput Datos necesarios para crear la categoría.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La categoría creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Categoria, { name: 'Categorias_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createCategoriaInput') createCategoriaInput: CreateCategoriaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Categoria> {
    const userId = new Types.ObjectId(new Types.ObjectId(user._id));
    return this.categoriaService.create(createCategoriaInput, userId);
  }

  /**
   * Obtiene todas las categorías con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías.
   *
   * @Roles: PUBLIC
   */
  @Query(() => [Categoria], { name: 'Categorias' })
  @IsPublic()
  async findAll(@Args() pagination?: PaginationArgs): Promise<Categoria[]> {
    return this.categoriaService.findAll(pagination);
  }

  /**
   * Obtiene todas las categorías con opciones de paginación y búsqueda.
   *
   * @param searchArgs Objeto que contiene un campo "search" (texto que se usará para realizar búsquedas).
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Categoria], { name: 'Categorias_findAllByNombre' })
  @RolesDec(...administradorUp)
  async findAllByNombre(
    @Args() searchArgs: SearchTextArgs,
    @Args() pagination?: PaginationArgs,
  ): Promise<Categoria[]> {
    return this.categoriaService.findAllByNombre(searchArgs, pagination);
  }

  /**
   * Obtiene una categoría específica por su ID.
   *
   * @param id ID único de la categoría.
   * @returns La categoría encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Categoria, { name: 'Categoria' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Categoria> {
    return this.categoriaService.findById(id);
  }

  /**
   * Actualiza una categoría existente por su ID.
   *
   * @param id ID de la categoría a actualizar.
   * @param updateCategoriaInput Datos para actualizar la categoría.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La categoría actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Categoria, { name: 'Categorias_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateCategoriaInput') updateCategoriaInput: UpdateCategoriaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Categoria> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.categoriaService.update(id, updateCategoriaInput, idUpdatedBy);
  }

  /**
   * Elimina lógicamente una categoría por su ID.
   *
   * @param idRemove ID de la categoría a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns La categoría eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Categoria, { name: 'Categorias_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Categoria> {
    const idThanos = new Types.ObjectId(user._id);
    return this.categoriaService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente una categoría por su ID.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id ID de la categoría a eliminar permanentemente.
   * @returns La categoría eliminada definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Categoria, { name: 'Categorias_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Categoria> {
    return this.categoriaService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las categorías que han sido eliminadas lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de categorías eliminadas.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Categorias_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.categoriaService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todas las categorías que han sido eliminadas lógicamente.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Categoria], {
    name: 'Categorias_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Categoria[]> {
    return this.categoriaService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una categoría que ha sido eliminada lógicamente.
   *
   * @param idRestore ID de la categoría a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La categoría restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Categoria> {
    const userId = new Types.ObjectId(user._id);
    return this.categoriaService.restore(idRestore, userId);
  }
}

