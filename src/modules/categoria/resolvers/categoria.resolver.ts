// import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
// import { CategoriaService } from '../services/categoria.service';
// import { CreateCategoriaInput } from '../dtos/create-categoria.input';
// import { Categoria } from '../entities/categoria.entity';

// @Resolver()
// export class CategoriaResolver {
//   constructor(private readonly categoriaService: CategoriaService) {}

//   @Mutation(() => Categoria)
//   async createCategoria(
//     @Args('createCategoriaInput') createCategoriaInput: CreateCategoriaInput,
//   ): Promise<Categoria> {
//     return this.categoriaService.create(createCategoriaInput);
//   }

//   @Query(() => [Categoria])
//   async categorias(): Promise<Categoria[]> {
//     return this.categoriaService.findAll();
//   }
// }

// categoria.resolver.ts

import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaInput } from '../dtos/create-categoria.input';
import { UpdateCategoriaInput } from '../dtos/update-categoria.input';
import { CategoriaService } from '../services/categoria.service';

import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';

@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => Categoria)
export class CategoriaResolver {
  constructor(private readonly categoriaService: CategoriaService) {}

  /**
   * Crea una nueva categoría.
   * @param createCategoriaInput Datos para crear la categoría.
   * @returns La categoría creada.
   */
  @Mutation(() => Categoria)
  async createCategoria(
    @Args('createCategoriaInput') createCategoriaInput: CreateCategoriaInput,
  ): Promise<Categoria> {
    return this.categoriaService.create(createCategoriaInput);
  }

  /**
   * Obtiene todas las categorías.
   * @returns Un array de categorías.
   */
  @Query(() => [Categoria], { name: 'categorias' })
  async findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  /**
   * Obtiene una categoría por su ID.
   * @param id ID de la categoría.
   * @returns La categoría encontrada.
   * @throws NotFoundException si la categoría no existe.
   */
  @Query(() => Categoria, { name: 'categoria' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Categoria> {
    return this.categoriaService.findOneById(id);
  }

  /**
   * Actualiza una categoría por su ID.
   * @param id ID de la categoría a actualizar.
   * @param updateCategoriaInput Datos para actualizar la categoría.
   * @returns La categoría actualizada.
   * @throws NotFoundException si la categoría no existe.
   */
  @Mutation(() => Categoria)
  async updateCategoria(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoriaInput') updateCategoriaInput: UpdateCategoriaInput,
  ): Promise<Categoria> {
    return this.categoriaService.update(id, updateCategoriaInput);
  }

  /**
   * Elimina una categoría por su ID.
   * @param id ID de la categoría a eliminar.
   * @returns La categoría eliminada.
   * @throws NotFoundException si la categoría no existe.
   */
  @Mutation(() => Categoria)
  async removeCategoria(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Categoria> {
    return this.categoriaService.remove(id);
  }

  // @Query(() => [Categoria], { name: 'categorias_findAllBy' })
  // @RolesDec(...administradorUp)
  // async findAllBy(
  //   @Args({ type: () => SearchArgs }) searchArgs: SearchArgs,
  //   @Args({ type: () => SearchField<T> }) searchField: SearchField<T>,
  //   @Args({ type: () => PaginationArgs, nullable: true })
  //   pagination?: PaginationArgs,
  // ): Promise<Categoria[]> {
  //   return this.categoriaService.findAllBy(searchArgs, searchField, pagination);
  // }
}
