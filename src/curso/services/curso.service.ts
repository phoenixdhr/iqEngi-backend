import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Curso } from '../entities/curso.entity';
import { OrdenService } from '../../orden/services/orden.service';
import { ComentarioService } from '../../comentario/services/comentario.service';
import { CuestionarioService } from '../../cuestionario/services/cuestionario.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCursoDto, UpdateCursoDto } from '../dtos/curso.dto';

import { CreateEstructuraProgramariaDto } from 'src/estructura-programaria/dtos/estructura-Programaria.dto';
import { MongooseUtilsService } from 'src/_mongoose-utils-service/services/_mongoose-utils-service.service';
import { EstructuraProgramariaService } from 'src/estructura-programaria/services/estructura-programaria.service';
import { InstructorService } from 'src/instructor/services/instructor.service';
import { CategoriaService } from 'src/categoria/services/categoria.service';
import { UsuarioService } from 'src/usuario/services/usuario.service';
// import { UpdateCursoInput } from '../dtos/input-gql/curso.input';

@Injectable()
export class CursoService {
  constructor(
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,

    @Inject(forwardRef(() => OrdenService))
    private readonly ordenesService: OrdenService,
    @Inject(forwardRef(() => CategoriaService))
    private readonly categoriasService: CategoriaService,
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuariosService: UsuarioService,

    private readonly comentariosService: ComentarioService,
    private readonly cuestionarioService: CuestionarioService,
    private readonly utils: MongooseUtilsService,
    private readonly instructoresService: InstructorService,
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

  async filterByEstructuraProgramariaId(estructuraProgramariaId: string) {
    const cursos = this.cursoModel
      .find({ estructuraProgramaria: estructuraProgramariaId })
      .exec();
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

    const data = { ...estructuraProgramaria, cursoId };

    const newEstructuraProgramaria =
      await this.estructuraProgramariaService.create(data);

    curso.estructuraProgramaria.push(newEstructuraProgramaria._id);
    curso.save();
    return newEstructuraProgramaria;
  }

  // #region Add methods
  async addAprenderas(cursoId: string, aprenderas: string[]) {
    this.utils.pushToArray(this.cursoModel, cursoId, 'aprenderas', aprenderas);
  }

  async addObjetivos(cursoId: string, objetivos: string[]) {
    this.utils.pushToArray(this.cursoModel, cursoId, 'objetivos', objetivos);
  }

  async addDirigidoA(cursoId: string, dirigidoA: string[]) {
    this.utils.pushToArray(this.cursoModel, cursoId, 'dirigidoA', dirigidoA);
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
      cursoId,
      'aprenderas',
      aprenderas,
    );
  }

  async removeObjetivos(cursoId: string, objetivos: string) {
    this.utils.pullFromArray(this.cursoModel, cursoId, 'objetivos', objetivos);
  }

  async removeDirigidoA(cursoId: string, dirigidoA: string) {
    this.utils.pullFromArray(this.cursoModel, cursoId, 'dirigidoA', dirigidoA);
  }
}
