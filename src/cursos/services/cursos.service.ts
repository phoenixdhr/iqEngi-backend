import { Injectable, NotFoundException } from '@nestjs/common';

import { Curso } from '../entities/curso.entity';
import { OrdenesService } from '../../ordenes/services/ordenes.service';
import { ComentariosService } from '../../comentarios/services/comentarios.service';
import { CuestionarioService } from '../../cuestionario/services/cuestionario.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCursoDto, UpdateCursoDto } from '../dtos/cursos.dto';

@Injectable()
export class CursosService {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly comentariosService: ComentariosService,
    private readonly cuestionarioService: CuestionarioService,
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,
  ) {}
  private counter = 103;

  findAll() {
    return this.cursoModel.find().exec();
  }

  async findOne(id: string) {
    const curso = await this.cursoModel.findById(id).exec();

    if (!curso) {
      throw new NotFoundException(`no se encontro ningun curso con id ${id}`);
    }

    return curso;
  }

  async create(data: CreateCursoDto) {
    const newCurso = new this.cursoModel(data);
    await newCurso.save();
    return newCurso;
  }

  async update(id: string, changes: UpdateCursoDto) {
    const updateCurso = await this.cursoModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!updateCurso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${id} para actualizar`,
      );
    }

    return updateCurso;
  }

  async delete(id: string) {
    const cursoEliminado = await this.cursoModel.findByIdAndDelete(id).exec();

    if (!cursoEliminado) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${id} para eliminar`,
      );
    }

    return cursoEliminado;
  }

  async findOrdenesByCursoId(cursoId: string) {
    // Utiliza el servicio de ordenes para buscar ordenes relacionados con el cursoId
    const ordenes = await this.ordenesService.filterByCursoId(cursoId);
    return ordenes;
  }

  async findComentariosByCursoId(cursoId: string) {
    // Utiliza el servicio de comentarios para buscar comentarios relacionados con el cursoId
    const comentarios = await this.comentariosService.filterByCursoId(cursoId);
    if (!comentarios) {
      throw new NotFoundException(
        `Comentarios para el curso con ID ${cursoId} no encontrados`,
      );
    }
    return comentarios;
  }

  async findCuestionariosByCursoId(cursoId: string) {
    // Utiliza el servicio de cuestionarios para buscar cuestionarios relacionados con el cursoId
    const cuestionarios =
      await this.cuestionarioService.filterByCursoId(cursoId);
    if (!cuestionarios) {
      throw new NotFoundException(
        `Cuestionarios para el curso con ID ${cursoId} no encontrados`,
      );
    }
    return cuestionarios;
  }

  async filterByCategoryId(categoryId: string) {
    const cursos = this.cursoModel.find({ categoria: categoryId }).exec();
    if (!cursos) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${categoryId}`,
      );
    }
    return cursos;
  }

  async addInstructor(cursoId: string, instructorId: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.instructor = new Types.ObjectId(instructorId);
    return curso.save();
  }

  async addAprenderas(cursoId: string, aprenderas: string[]) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.aprenderas.push(...aprenderas);
    return curso.save();
  }

  async addObjetivos(cursoId: string, objetivos: string[]) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.objetivos.push(...objetivos);
    return curso.save();
  }
  async addDirigidoA(cursoId: string, dirigidoA: string[]) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.dirigidoA.push(...dirigidoA);
    return curso.save();
  }

  async addEstructuraProgramaria(
    cursoId: string,
    estructuraProgramariaId: string[],
  ) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.estructuraProgramaria.push(...estructuraProgramariaId);
    return curso.save();
  }

  async addCategoria(cursoId: string, categoriaId: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.categorias.push(categoriaId);
    return curso.save();
  }

  async removeInstructor(cursoId: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.instructor = null;
    return curso.save();
  }

  async removeAprenderas(cursoId: string, aprenderas: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.aprenderas.pull(aprenderas);
    return curso.save();
  }

  async removeObjetivos(cursoId: string, objetivos: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.objetivos.pull(objetivos);
    // curso.objetivos = curso.objetivos.filter((item) => item !== objetivos);
    return curso.save();
  }

  async removeDirigidoA(cursoId: string, dirigidoA: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.dirigidoA.pull(dirigidoA);
    return curso.save();
  }

  async removeEstructuraProgramaria(
    cursoId: string,
    estructuraProgramariaId: string,
  ) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.estructuraProgramaria.pull(estructuraProgramariaId);
    return curso.save();
  }

  async removeCategoria(cursoId: string, categoriaId: string) {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    curso.categorias.pull(categoriaId);
    return curso.save();
  }
}
