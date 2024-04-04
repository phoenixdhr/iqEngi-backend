import { Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from '../entities/categoria.entity';
import { CursosService } from 'src/cursos/services/cursos.service';

@Injectable()
export class CategoriasService {
  constructor(private readonly cursosService: CursosService) {}

  private counter = 3;
  private categorias: Categoria[] = [
    {
      _id: '1',
      nombre: 'Ingeniería Mecánica',
      descripcion:
        'Cursos relacionados con la ingeniería mecánica y diseño industrial.',
    },
    {
      _id: '2',
      nombre: 'Ingeniería Industrial',
      descripcion:
        'Cursos centrados en la optimización de procesos industriales y sistemas de producción.',
    },
    {
      _id: '3',
      nombre: 'Normas y Certificaciones',
      descripcion:
        'Cursos enfocados en normativas específicas y certificaciones industriales como API y ASME.',
    },
    // Puedes agregar más categorías según sea necesario
  ];

  // Encuentra todas las categorías
  findAll() {
    return this.categorias;
  }

  // Encuentra una categoría por su ID
  findOne(id: string): Categoria {
    const categoria = this.categorias.find((categoria) => categoria._id === id);
    if (!categoria) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }
    return categoria;
  }

  // Crea una nueva categoría
  create(payload: any): Categoria {
    this.counter++;
    const newCategoria: Categoria = {
      _id: this.counter.toString(),
      ...payload,
    };
    this.categorias.push(newCategoria);
    return newCategoria;
  }

  // Actualiza una categoría existente por su ID
  update(id: string, payload: any): Categoria {
    const index = this.categorias.findIndex(
      (categoria) => categoria._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `Categoria con ID ${id} no encontrada para actualizar`,
      );
    }
    // Actualiza la categoría. Considera validaciones adicionales para producción.
    this.categorias[index] = { ...this.categorias[index], ...payload };
    return this.categorias[index];
  }

  // Elimina una categoría por su ID
  delete(id: string): Categoria {
    const index = this.categorias.findIndex(
      (categoria) => categoria._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `Categoria con ID ${id} no encontrada para eliminar`,
      );
    }
    const categoria = this.categorias[index];
    this.categorias = this.categorias.filter(
      (categoria) => categoria._id !== id,
    );
    return categoria;
  }

  findCursosByCategoriaId(id: string) {
    const cursos = this.cursosService.findAll().map((curso) => {
      if (curso.categoriaIds.includes(id)) return curso;
    });

    if (!cursos) {
      throw new NotFoundException(
        `No hay ningun curso registrado con la categoria ID ${id} no encontrados`,
      );
    }
    return cursos;
  }
}
