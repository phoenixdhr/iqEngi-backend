import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionInput } from '../dtos/create-calificacion.input';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectModel(Calificacion.name)
    private readonly calificacionModel: Model<Calificacion>,
  ) {}

  async create(calificacion: CreateCalificacionInput): Promise<Calificacion> {
    const newCalificacion = new this.calificacionModel(calificacion);
    return newCalificacion.save();
  }

  async findAll(): Promise<Calificacion[]> {
    return this.calificacionModel.find().exec();
  }

  async findOneById(id: string): Promise<Calificacion> {
    return this.calificacionModel.findById(id).exec();
  }
}
