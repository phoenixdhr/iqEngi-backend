import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden, Orden } from '../entities/orden.entity'; // Asegúrate de ajustar la ruta de importación
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>,
  ) {}

  // Encuentra todas las órdenes
  findAll() {
    return this.ordenModel.find().exec();
  }

  // Encuentra una orden por su ID
  async findOne(id: string) {
    const orden = this.ordenModel.findById(id).exec();
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return orden;
  }

  // Crea una nueva orden
  async create(data: any) {
    // Genera un nuevo ID basado en el máximo actual y lo convierte a string
    const newOrden = new this.ordenModel(data);
    await newOrden.save();
    return newOrden;
  }

  // Actualiza una orden existente por su ID
  async update(id: string, changes: any) {
    const updateOrden = await this.ordenModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!updateOrden) {
      throw new NotFoundException(
        `Orden con ID ${id} no encontrada para actualizar`,
      );
    }

    return updateOrden;
  }

  // Elimina una orden por su ID
  async delete(id: string) {
    const ordenEliminada = await this.ordenModel.findByIdAndDelete(id).exec();

    if (!ordenEliminada) {
      throw new NotFoundException(
        `Orden con ID ${id} no encontrada para eliminar`,
      );
    }

    return ordenEliminada;
  }

  async filterByCursoId(cursoId: string) {
    return this.ordenModel.find({ curso: cursoId }).exec();
  }

  async filterByEstado(estado: EstadoOrden) {
    return this.ordenModel.find({ estado }).exec();
  }

  async filterByUsuarioId(usuarioId: string) {
    return this.ordenModel.find({ usuario: usuarioId }).exec();
  }
}
