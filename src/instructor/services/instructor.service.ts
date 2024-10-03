import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Instructor } from '../entities/instructor.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateInstructorDto,
  FilterInstructorDto,
  UpdateInstructorDto,
} from '../dtos/instructor.dto';
import { CursoService } from '../../curso/services/curso.service';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name)
    private instructorModel: Model<Instructor>,
    @Inject(forwardRef(() => CursoService))
    private readonly cursosService: CursoService,
  ) {}

  // #region CRUD service
  async findAll(params?: FilterInstructorDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.instructorModel.find().skip(offset).limit(limit).exec();
    }
    return await this.instructorModel.find().exec();
  }

  async findOne(id: string) {
    const instructor = await this.instructorModel.findById(id).exec();

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id}`,
      );
    }
    return instructor;
  }

  async create(data: CreateInstructorDto) {
    try {
      const newInstructor = await this.instructorModel.create(data);
      return newInstructor;
    } catch (error) {
      // Aquí podrías manejar errores específicos o lanzar una excepción personalizada
      // throw new Error('Error al crear el instructor: ' + error.message);
      throw new InternalServerErrorException(
        'Error al crear el instructor: ' + error.message,
      );
    }
  }

  async update(id: string, changes: UpdateInstructorDto) {
    const instructor = await this.instructorModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id} para actualizar`,
      );
    }

    return instructor;
  }

  async delete(id: string) {
    const instructorEliminado = await this.instructorModel
      .findByIdAndDelete(id)
      .exec();

    if (!instructorEliminado) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id} para eliminar`,
      );
    }

    return instructorEliminado; // Retorna el documento eliminado
  }

  // #region Add
  async addEspecializacion(instructorId: string, especializacion: string[]) {
    const instructor = await this.instructorModel.findById(instructorId).exec();

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${instructorId}`,
      );
    }

    instructor.especializacion.push(...especializacion);
    return await instructor.save();
  }

  // #region Remove
  async removeEspecializacion(instructorId: string, especializacion: string) {
    const instructor = await this.instructorModel.findById(instructorId).exec();

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${instructorId}`,
      );
    }

    instructor.especializacion.pull(especializacion);
    return await instructor.save();
  }

  // #region Find import Service
  async findCursosByInstructorId(instructorId: string) {
    const cursos = await this.cursosService.filterByInstructorId(instructorId);
    if (!cursos) {
      throw new NotFoundException(
        `Cursos para el instructor con ID ${instructorId} no encontrados`,
      );
    }
    return cursos;
  }
}
