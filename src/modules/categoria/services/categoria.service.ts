import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaInput } from 'src/modules/categoria/dtos/create-categoria.input';
import { UpdateCategoriaInput } from 'src/modules/categoria/dtos/update-categoria.input';
import { BaseService } from 'src/common/services/base.service';
import SearchField from 'src/common/clases/search-field.class';
import { SearchTextArgs, PaginationArgs } from 'src/common/dtos';

@Injectable()
export class CategoriaService extends BaseService<
  Categoria,
  UpdateCategoriaInput,
  CreateCategoriaInput
> {
  constructor(
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<Categoria>,
  ) {
    super(categoriaModel);
  }

  /**
   * Busca todas las categorías que coinciden con un nombre específico, aplicando opciones de búsqueda y paginación.
   *
   * @param searchTextArgs Argumentos que contienen el texto de búsqueda para filtrar las categorías por nombre.
   * @param paginationArgs Opcionales. Argumentos para manejar la paginación de los resultados.
   * @returns Una promesa que resuelve en un array de categorías que cumplen con los criterios de búsqueda.
   */
  async findAllByNombre(
    searchTextArgs: SearchTextArgs,
    paginationArgs?: PaginationArgs,
  ): Promise<Categoria[]> {
    // Crea una instancia de `SearchField` especificando el campo de búsqueda como 'nombre'.
    const searchField: SearchField<Categoria> = new SearchField();
    searchField.field = 'nombre';

    // Llama al método `findAllBy` de la clase padre `BaseService` pasando los argumentos de búsqueda, el campo de búsqueda y los argumentos de paginación.
    return super.findAllBy(
      searchTextArgs,
      searchField,
      paginationArgs,
    ) as Promise<Categoria[]>;
  }
}
