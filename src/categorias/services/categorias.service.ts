import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Categoria } from '../entities/categoria.entity';
import { CursosService } from 'src/cursos/services/cursos.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dtos/categorias.dto';

@Injectable()
export class CategoriasService {
  constructor(
    private readonly cursosService: CursosService,
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<Categoria>,
  ) {}

  //#region CRUD service

  // Encuentra todas las categorías
  findAll() {
    return this.categoriaModel.find().exec();
  }

  // Encuentra una categoría por su ID
  async findOne(id: string) {
    const categoria = await this.categoriaModel.findById(id).exec();

    if (!categoria) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }

    return categoria;
  }

  // Crea una nueva categoría
  async create(data: CreateCategoriaDto) {
    const newCategoria = await this.categoriaModel.create(data);
    return newCategoria;
  }

  // Actualiza una categoría existente por su ID
  async update(categoryId: string, changes: UpdateCategoriaDto) {
    const updateCategoria = await this.categoriaModel
      .findByIdAndUpdate(categoryId, { $set: changes }, { new: true })
      .exec();

    if (!updateCategoria) {
      throw new NotFoundException(
        `No se encontró ninguna categoria con el ID ${categoryId} para actualizar`,
      );
    }

    return updateCategoria;
  }

  // Elimina una categoría por su ID
  async delete(categoryId: string) {
    const categoriaEliminada = await this.categoriaModel
      .findByIdAndDelete(categoryId)
      .exec();

    if (!categoriaEliminada) {
      throw new NotFoundException(
        `Categoria con ID ${categoryId} no encontrada para eliminar`,
      );
    }
    return categoriaEliminada;
  }

  //#region Find
  async findCursosByCategoriaId(categoryId: string) {
    const cursosFilterByCategory =
      await this.cursosService.filterByCategoryId(categoryId);

    if (!cursosFilterByCategory) {
      throw new NotFoundException(
        `No hay ningun curso registrado con la categoria ID ${categoryId} no encontrados`,
      );
    }
    return cursosFilterByCategory;
  }
}
