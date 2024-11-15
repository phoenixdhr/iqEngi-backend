import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Orden } from '../entities/orden.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdenService {
  constructor(
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>,
  ) {}

  // findVentasPorCurso no ha sido Testeada
  async findVentasPorCurso(
    cursoId: string,
    limit: number,
    offset: number,
  ): Promise<Orden[]> {
    return this.ordenModel
      .find({ 'cursos.cursoId': cursoId })
      .populate('usuarioId', 'firstName lastName email')
      .populate('cursos.cursoId', 'titulo precio')
      .limit(limit)
      .skip(offset)
      .exec();
  }
}
