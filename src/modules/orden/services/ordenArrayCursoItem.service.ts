import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Orden } from '../entities/orden.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { CreateOrdenCursoItemDto } from '../dtos/create-ordenCursoItem.input';

@Injectable()
export class OrdenArrayCursoService {
  constructor(
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>, // Modelo Mongoose para gestionar la colección de órdenes.
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>, // Modelo Mongoose para gestionar la colección de cursos.
  ) {}

  /**
   * Agrega una lista de cursos a la orden especificada.
   *
   * Este método valida si los cursos ya existen en la orden para evitar duplicados.
   * Además, recalcula el monto total de la orden después de agregar los nuevos cursos.
   *
   * @param idOrden ID de la orden a la que se agregarán los cursos.
   * @param idUser ID del usuario que realiza la operación (reservado para posibles auditorías).
   * @param listaCursosId Lista de IDs de los cursos a agregar.
   * @param arrayName Nombre del campo del array que se actualizará (por defecto: 'listaCursos').
   * @returns La orden actualizada con los cursos agregados.
   */
  async pushToArray(
    idOrden: Types.ObjectId,
    idUser: Types.ObjectId,
    listaCursosId: Types.ObjectId[],
    arrayName: keyof Orden = 'listaCursos',
  ): Promise<Orden> {
    // Convertir los IDs de cursos a ObjectId para consultas en MongoDB.
    const cursoObjectIds = listaCursosId.map((id) => new Types.ObjectId(id));

    // Obtener la orden actual para verificar su estado.
    const orden = await this.ordenModel.findById(idOrden).exec();
    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Filtrar los cursos que ya están en la orden para evitar duplicados.
    const cursosExistentes = new Set(
      orden.listaCursos.map((curso) => curso.cursoId.toString()),
    );
    const cursosAAgregarIds = cursoObjectIds.filter(
      (id) => !cursosExistentes.has(id.toString()),
    );

    // Si todos los cursos ya están en la orden, lanzar un error.
    if (cursosAAgregarIds.length === 0) {
      throw new Error('Todos los cursos ya están en la orden');
    }

    // Validar que los cursos a agregar existen en la base de datos y no están eliminados.
    const cursosAAgregar = await this.cursoModel
      .find({
        _id: { $in: cursosAAgregarIds },
        deleted: false, // Filtrar cursos eliminados.
      })
      .exec();

    // Verificar que todos los cursos solicitados están disponibles.
    if (cursosAAgregar.length !== cursosAAgregarIds.length) {
      throw new NotFoundException(
        'Algunos cursos no fueron encontrados o están eliminados.',
      );
    }

    // Mapear los cursos para adaptarlos al formato del subdocumento OrdenCursoItem.
    const cursosItems: CreateOrdenCursoItemDto[] = cursosAAgregar.map(
      (curso) => ({
        cursoId: new Types.ObjectId(curso._id),
        precio: curso.precio || 0, // Manejar precios nulos asignando 0 por defecto.
        courseTitle: curso.courseTitle, // Título del curso.
        descuento: curso.descuento || 0, // Descuento (0 por defecto si es nulo).
      }),
    );

    // Combinar la lista de cursos existente con los nuevos cursos.
    const updatedListaCursos = [...orden.listaCursos, ...cursosItems];

    // Recalcular el monto total de la orden basado en la lista de cursos actualizada.
    const montoTotal = updatedListaCursos.reduce(
      (acc, curso) => acc + curso.precio * (1 - curso.descuento / 100),
      0,
    );

    // Actualizar la orden en la base de datos.
    const updatedOrden = await this.ordenModel
      .findByIdAndUpdate(
        idOrden,
        {
          $set: {
            [arrayName]: updatedListaCursos, // Actualizar el array de cursos.
            montoTotal, // Actualizar el monto total.
          },
        },
        { new: true }, // Retornar el documento actualizado.
      )
      .exec();

    if (!updatedOrden) {
      throw new NotFoundException('Orden no encontrada');
    }

    return updatedOrden;
  }

  /**
   * Elimina una lista de cursos de la orden especificada.
   *
   * Este método elimina los cursos indicados del array `listaCursos` y recalcula
   * el monto total de la orden después de la eliminación.
   *
   * @param idOrden ID de la orden de la que se eliminarán los cursos.
   * @param listaCursosId Lista de IDs de los cursos a eliminar.
   * @param arrayName Nombre del campo del array que se actualizará (por defecto: 'listaCursos').
   * @returns La orden actualizada después de la eliminación.
   */
  async pullFromArray(
    idOrden: Types.ObjectId,
    listaCursosId: Types.ObjectId[],
    arrayName: keyof Orden = 'listaCursos',
  ): Promise<Orden> {
    // Convertir los IDs de cursos a ObjectId para consultas en MongoDB.
    const cursoObjectIds = listaCursosId.map((id) => new Types.ObjectId(id));

    // Obtener la orden actual para verificar su estado.
    const orden = await this.ordenModel.findById(idOrden).exec();
    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Filtrar los cursos que no serán eliminados, creando una lista actualizada.
    const updatedListaCursos = orden.listaCursos.filter(
      (curso) => !cursoObjectIds.some((id) => id.equals(curso.cursoId)),
    );

    // Recalcular el monto total de la orden basado en la lista actualizada.
    const montoTotal = updatedListaCursos.reduce(
      (acc, curso) => acc + curso.precio * (1 - curso.descuento / 100),
      0,
    );

    // Actualizar la orden en la base de datos.
    const updatedOrden = await this.ordenModel
      .findByIdAndUpdate(
        idOrden,
        {
          $set: {
            [arrayName]: updatedListaCursos, // Actualizar el array de cursos.
            montoTotal, // Actualizar el monto total.
          },
        },
        { new: true }, // Retornar el documento actualizado.
      )
      .exec();

    if (!updatedOrden) {
      throw new NotFoundException('Orden no encontrada');
    }

    return updatedOrden;
  }
}
