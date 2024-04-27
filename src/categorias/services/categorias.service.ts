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
  async update(id: string, changes: UpdateCategoriaDto) {
    const categoria = await this.categoriaModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!categoria) {
      throw new NotFoundException(
        `No se encontró ninguna categoria con el ID ${id} para actualizar`,
      );
    }

    return categoria;
  }

  // Elimina una categoría por su ID
  async delete(id: string) {
    const categoriaEliminada = await this.categoriaModel
      .findByIdAndDelete(id)
      .exec();

    if (!categoriaEliminada) {
      throw new NotFoundException(
        `Categoria con ID ${id} no encontrada para eliminar`,
      );
    }
    return categoriaEliminada;
  }

  // async findCursosByCategoriaId(id: string) {
  //   const cursos = this.cursosService.findAll().map((curso) => {
  //     if (curso.categoriaIds.includes(id)) return curso;
  //   });

  //   if (!cursos) {
  //     throw new NotFoundException(
  //       `No hay ningun curso registrado con la categoria ID ${id} no encontrados`,
  //     );
  //   }
  //   return cursos;
  // }
}
