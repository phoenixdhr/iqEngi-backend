import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Opcion } from '../entities/opcion.entity';
import { UpdateOpcionInput } from '../dtos/opcion-dtos/update-opcion.input';
import { CreateOpcionInput } from '../dtos/opcion-dtos/create-opcion.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class OpcionService extends BaseService<
  Opcion,
  UpdateOpcionInput,
  CreateOpcionInput
> {
  constructor(
    @InjectModel(Opcion.name)
    private readonly opcionModel: Model<Opcion>, // Modelo para gestionar la colección "Opcion"
    // private readonly cursoService: CursoService,
  ) {
    super(opcionModel);
  }

  //#region create
  /**
   * Crea una nueva opción en la base de datos.
   *
   * Este método utiliza la lógica básica del servicio para crear una nueva opción.
   *
   * @param createOpcionInput - Datos necesarios para crear la opción.
   * @param userId - ID del usuario que está creando la opción.
   * @returns La opción creada.
   */
  async create(
    createOpcionInput: CreateOpcionInput,
    userId: Types.ObjectId,
  ): Promise<Opcion> {
    // Crear la nueva opción utilizando el método genérico de la clase base
    const newOpcion = await super.create(createOpcionInput, userId);

    return newOpcion;
  }
  //#endregion
}
