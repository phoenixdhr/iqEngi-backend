import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoOrden, Orden } from '../entities/orden.entity'; // Asegúrate de ajustar la ruta de importación
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CursoService } from 'src/curso/services/curso.service';
import { CreateOrdenDto } from '../dtos/orden.dto';

@Injectable()
export class OrdenService {
  constructor(
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>,
    @Inject(forwardRef(() => CursoService))
    private readonly cursosService: CursoService,
  ) {}

  // #region CRUD service
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
  async create(data: CreateOrdenDto) {
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

  // #region Update
  async updateEstado(id: string, estado: EstadoOrden) {
    return this.update(id, { estado });
  }

  // #region add ObjectID
  async addCursoToOrden(ordenId: string, cursoId: string) {
    const orden = await this.findOne(ordenId);
    await this.cursosService.findOne(cursoId);

    orden.cursos.push(cursoId);
    await orden.save();
    return orden;
  }

  // #region remove ObjectID
  async removeCursoFromOrden(ordenId: string, cursoId: string) {
    const orden = await this.findOne(ordenId);
    await this.cursosService.findOne(cursoId);

    orden.cursos.pull(cursoId);
    await orden.save();
    return orden;
  }

  // #region Filter
  async filterByCursoId(cursoId: string) {
    return this.ordenModel.find({ curso: cursoId }).exec();
  }

  async filterByUsuarioId(usuarioId: string) {
    return this.ordenModel.find({ usuario: usuarioId }).exec();
  }

  async filterByEstado(estado: EstadoOrden) {
    return this.ordenModel.find({ estado }).exec();
  }
}
