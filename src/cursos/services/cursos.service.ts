import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Curso } from '../entities/curso.entity';
import { OrdenesService } from '../../ordenes/services/ordenes.service';
import { ComentariosService } from '../../comentarios/services/comentarios.service';
import { CuestionarioService } from '../../cuestionario/services/cuestionario.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCursoDto, UpdateCursoDto } from '../dtos/cursos.dto';

import { CreateEstructuraProgramariaDto } from 'src/estructura-programaria/dtos/estructura-Programaria.dto';
import { MongooseUtilsService } from 'src/_mongoose-utils-service/services/_mongoose-utils-service.service';
import { EstructuraProgramariaService } from 'src/estructura-programaria/services/estructura-programaria.service';
import { InstructoresService } from 'src/instructores/services/instructores.service';
import { CategoriasService } from 'src/categorias/services/categorias.service';
import { UsuariosService } from 'src/usuarios/services/usuarios.service';

@Injectable()
export class CursosService {
  constructor(
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,

    @Inject(forwardRef(() => OrdenesService))
    private readonly ordenesService: OrdenesService,
    @Inject(forwardRef(() => CategoriasService))
    private readonly categoriasService: CategoriasService,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService,

    private readonly comentariosService: ComentariosService,
    private readonly cuestionarioService: CuestionarioService,
    private readonly utils: MongooseUtilsService,
    private readonly instructoresService: InstructoresService,
    private readonly estructuraProgramariaService: EstructuraProgramariaService,
  ) {}
  private counter = 103;

  // #region CRUD Cursos
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

  // #region Find import Service
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

  async findUsuariosByCursoId(cursoId: string) {
    // Utiliza el servicio de ordenes para buscar ordenes relacionados con el cursoId
    const usuarios = await this.usuariosService.filterByCursoId(cursoId);
    if (!usuarios) {
      throw new NotFoundException(
        `Usuarios para el curso con ID ${cursoId} no encontrados`,
      );
    }
    return usuarios;
  }

  // #region Filter methods
  async filterByCategoryId(categoryId: string) {
    const cursos = this.cursoModel.find({ categoria: categoryId }).exec();
    return cursos;
  }

  async filterByInstructorId(instructorId: string) {
    const cursos = this.cursoModel.find({ instructor: instructorId }).exec();
    return cursos;
  }

  // #region Add ObjectId
  async addInstructor(cursoId: string, instructorId: string) {
    const curso = await this.findOne(cursoId);
    const instructor = await this.instructoresService.findOne(instructorId);

    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }

    if (!instructor) {
      throw new NotFoundException(
        `no se encontro ningun instructor con id ${instructorId}`,
      );
    }

    curso.instructor = new Types.ObjectId(instructorId);
    return curso.save();
  }

  async addCategoria(cursoId: string, categoriaId: string) {
    const curso = await this.findOne(cursoId);
    const categoria = await this.categoriasService.findOne(categoriaId);

    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }

    if (!categoria) {
      throw new NotFoundException(
        `no se encontro ninguna categoria con id ${categoriaId}`,
      );
    }
    curso.categorias.push(categoriaId);
    return curso.save();
  }

  // #region Add ObjectId Schema
  async addEstructuraProgramaria(
    cursoId: string,
    estructuraProgramaria: CreateEstructuraProgramariaDto,
  ) {
    const curso = await this.findOne(cursoId);
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }
    const newEstructuraProgramaria =
      await this.estructuraProgramariaService.create(estructuraProgramaria);

    curso.estructuraProgramaria.push(newEstructuraProgramaria._id);
    curso.save();
    return newEstructuraProgramaria;
  }

  // #region Add methods
  async addAprenderas(cursoId: string, aprenderas: string[]) {
    this.utils.pushToArray(this.cursoModel, 'aprenderas', cursoId, aprenderas);
  }

  async addObjetivos(cursoId: string, objetivos: string[]) {
    this.utils.pushToArray(this.cursoModel, 'objetivos', cursoId, objetivos);
  }

  async addDirigidoA(cursoId: string, dirigidoA: string[]) {
    this.utils.pushToArray(this.cursoModel, 'dirigidoA', cursoId, dirigidoA);
  }

  // #region Remove ObjectId
  async removeInstructor(cursoId: string, instructorId: string) {
    const curso = await this.findOne(cursoId);
    const instructor = await this.instructoresService.findOne(instructorId);

    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }

    if (!instructor) {
      throw new NotFoundException(
        `no se encontro ningun instructor con id ${instructorId}`,
      );
    }

    curso.instructor = null;
    return curso.save();
  }

  async removeCategoria(cursoId: string, categoriaId: string) {
    const curso = await this.findOne(cursoId);
    const categoria = await this.categoriasService.findOne(categoriaId);

    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }

    if (!categoria) {
      throw new NotFoundException(
        `no se encontro ninguna categoria con id ${categoriaId}`,
      );
    }

    curso.categorias.pull(categoriaId);
    return curso.save();
  }

  // #region Remove ObjectId Schema
  async removeEstructuraProgramaria(
    cursoId: string,
    estructuraProgramariaId: string,
  ) {
    const curso = await this.findOne(cursoId);
    if (!curso) {
      throw new NotFoundException(
        `no se encontro ningun curso con id ${cursoId}`,
      );
    }

    this.estructuraProgramariaService.delete(estructuraProgramariaId);
    curso.estructuraProgramaria.pull(estructuraProgramariaId);
    return curso.save();
  }

  // #region Remove methods

  async removeAprenderas(cursoId: string, aprenderas: string) {
    this.utils.pullFromArray(
      this.cursoModel,
      'aprenderas',
      cursoId,
      aprenderas,
    );
  }

  async removeObjetivos(cursoId: string, objetivos: string) {
    this.utils.pullFromArray(this.cursoModel, 'objetivos', cursoId, objetivos);
  }

  async removeDirigidoA(cursoId: string, dirigidoA: string) {
    this.utils.pullFromArray(this.cursoModel, 'dirigidoA', cursoId, dirigidoA);
  }
}
