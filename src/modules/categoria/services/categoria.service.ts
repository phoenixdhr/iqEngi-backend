import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaInput } from 'src/modules/categoria/dtos/create-categoria.input';
import { UpdateCategoriaInput } from 'src/modules/categoria/dtos/update-categoria.input';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<Categoria>,
  ) {}

  /**
   * Crea una nueva categoría.
   * @param createCategoriaInput Datos para crear la categoría.
   * @returns La categoría creada.
   */
  async create(createCategoriaInput: CreateCategoriaInput): Promise<Categoria> {
    const newCategoria = new this.categoriaModel(createCategoriaInput);
    try {
      return await newCategoria.save();
    } catch (error) {
      // Manejo de errores en la creación
      throw new InternalServerErrorException(
        'Error al crear la categoría',
        error.message,
      );
    }
  }

  /**
   * Obtiene todas las categorías.
   * @returns Un array de categorías.
   */
  async findAll(): Promise<Categoria[]> {
    return this.categoriaModel.find().exec();
  }

  /**
   * Obtiene una categoría por su ID.
   * @param id ID de la categoría.
   * @returns La categoría encontrada.
   * @throws NotFoundException si la categoría no existe.
   */
  async findOneById(id: string): Promise<Categoria> {
    const categoria = await this.categoriaModel.findById(id).exec();
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  /**
   * Actualiza una categoría por su ID.
   * @param id ID de la categoría a actualizar.
   * @param updateCategoriaInput Datos para actualizar la categoría.
   * @returns La categoría actualizada.
   * @throws NotFoundException si la categoría no existe.
   */
  async update(
    id: string,
    updateCategoriaInput: UpdateCategoriaInput,
  ): Promise<Categoria> {
    const updatedCategoria = await this.categoriaModel
      .findByIdAndUpdate(id, updateCategoriaInput, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCategoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return updatedCategoria;
  }

  /**
   * Elimina una categoría por su ID.
   * @param id ID de la categoría a eliminar.
   * @returns La categoría eliminada.
   * @throws NotFoundException si la categoría no existe.
   */
  async remove(id: string): Promise<Categoria> {
    const deletedCategoria = await this.categoriaModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCategoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return deletedCategoria;
  }
}
