import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionInput } from '../dtos/create-calificacion.input';
import { UpdateCalificacionInput } from '../dtos/update-calificacion.input';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class CalificacionService extends BaseService<
  Calificacion,
  UpdateCalificacionInput,
  CreateCalificacionInput
> {
  constructor(
    @InjectModel(Calificacion.name)
    private readonly calificacionModel: Model<Calificacion>,
  ) {
    super(calificacionModel);
  }
  //#region Métodos Generales IBaseResolver modificados
  /**
   * Crea una nueva calificación.
   * @param createCalificacionInput Datos para crear la calificación.
   * @returns La calificación creada.
   */
  async create(
    createCalificacionInput: CreateCalificacionInput,
    userid: string,
  ): Promise<Calificacion> {
    const idCurso = String(createCalificacionInput.cursoId);
    // const idUsuario = String(createCalificacionInput.usuarioId);

    const curso = await this.findByCursoId(idCurso);

    if (!curso) {
      throw new NotFoundException('El curso no existe');
    }
    // const usuario = await this.findByUsuarioId(idUsuario);

    // if (!usuario) {
    //   throw new NotFoundException('El usuario no existe');
    // }

    return super.create(
      // createCalificacionInput,
      { ...createCalificacionInput, cursoId: new Types.ObjectId(idCurso) },
      userid,
    );
  }

  //#region Métodos Personales
  /**
   * Obtiene calificaciones por curso ID.
   * @param cursoId ID del curso.
   * @returns Un array de calificaciones del curso.
   */
  async findByCursoId(cursoId: string): Promise<Calificacion[]> {
    return this.calificacionModel.find({ cursoId }).exec();
  }

  /**
   * Obtiene calificaciones por usuario ID.
   * @param usuarioId ID del usuario.
   * @returns Un array de calificaciones del usuario.
   */
  async findByUsuarioId(usuarioId: string): Promise<Calificacion[]> {
    return this.calificacionModel.find({ usuarioId }).exec();
  }

  /**
   * Calcula el promedio de calificaciones de un curso.
   * @param cursoId ID del curso.
   * @returns El promedio de calificaciones.
   */
  async calculatePromedio(cursoId: string): Promise<number> {
    const calificaciones = await this.findByCursoId(cursoId);
    if (calificaciones.length === 0) {
      return 0;
    }
    const sum = calificaciones.reduce(
      (acc, calificacion) => acc + calificacion.valor,
      0,
    );
    return sum / calificaciones.length;
  }
}
