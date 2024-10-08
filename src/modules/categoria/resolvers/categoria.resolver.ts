import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { CategoriaService } from '../services/categoria.service';
import { CreateCategoriaInput } from '../dtos/create-categoria.input';
import { Categoria } from '../entities/categoria.entity';

@Resolver()
export class CategoriaResolver {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Mutation(() => Categoria)
  async createCategoria(
    @Args('createCategoriaInput') createCategoriaInput: CreateCategoriaInput,
  ): Promise<Categoria> {
    return this.categoriaService.create(createCategoriaInput);
  }

  @Query(() => [Categoria])
  async categorias(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }
}
