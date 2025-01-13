import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Orden } from '../entities/orden.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateOrdenInput } from '../dtos/update-orden.input';
import { CreateOrdenInput } from '../dtos/create-orden.input';
import { BaseService } from 'src/common/services/base.service';
import { PaginationArgs } from 'src/common/dtos';
import { Types } from 'mongoose';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { OrdenCursoItem } from '../entities/ordenCursoItem.entity';

@Injectable()
export class OrdenService extends BaseService<
  Orden,
  UpdateOrdenInput,
  CreateOrdenInput
> {
  constructor(
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>, // Modelo Mongoose para gestionar la colección de órdenes.
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>, // Modelo Mongoose para gestionar la colección de cursos.
    // private readonly cursoService: CursoService, // (Comentado) Podría utilizarse si se prefiere un servicio para manejar lógica adicional en lugar de usar el modelo directamente.
  ) {
    super(ordenModel); // Inicialización del servicio base con el modelo de órdenes.
  }

  /**
   * Crea una nueva orden asociada a una lista de cursos.
   *
   * Este método verifica si todos los cursos solicitados existen y no están eliminados.
   * Luego crea una nueva orden con la lista de cursos válida.
   *
   * @param listCursos Lista de IDs de los cursos que se incluirán en la orden.
   * @param userId ID del usuario que realiza la operación.
   * @returns La orden recién creada.
   */
  async _create(
    listCursos: Types.ObjectId[],
    userId: Types.ObjectId,
  ): Promise<Orden> {
    // Convertir los IDs de cursos a ObjectId para consultas en MongoDB.
    const cursoObjectIds = listCursos.map((id) => new Types.ObjectId(id));

    // Recuperar cursos válidos (que no estén eliminados).
    const cursosArray: Curso[] = await this.cursoModel
      .find({
        _id: { $in: cursoObjectIds },
        deleted: false, // Filtra cursos que no estén marcados como eliminados.
      })
      .exec();

    // Verificar si todos los cursos solicitados fueron encontrados.
    if (cursosArray.length !== listCursos.length) {
      throw new NotFoundException(
        'Algunos cursos no fueron encontrados o están eliminados.',
      );
    }

    // Mapear los cursos para adaptarlos al subdocumento OrdenCursoItem.
    const cursos: OrdenCursoItem[] = cursosArray.map((curso) => ({
      cursoId: new Types.ObjectId(curso._id),
      precio: curso.precio || 0, // Manejar precios nulos asignando 0 por defecto.
      courseTitle: curso.courseTitle, // Título del curso.
      descuento: curso.descuento || 0, // Descuento (0 por defecto si es nulo).
    }));

    // Crear la estructura de datos para la nueva orden.
    const createOrden: CreateOrdenInput = {
      listaCursos: cursos, // Lista de cursos validados.
      usuarioId: userId, // ID del usuario asociado a la orden.
    };

    // Crear la orden utilizando el método genérico del servicio base.
    return super.create(createOrden, userId);
  }

  /**
   * Busca órdenes asociadas a un curso específico.
   *
   * Este método permite filtrar órdenes en base a un curso específico y paginar los resultados.
   *
   * @param cursoId ID del curso a buscar en las órdenes.
   * @param pagination Parámetros de paginación (límite y desplazamiento).
   * @returns Lista de órdenes que incluyen el curso especificado.
   */
  async findByCursoId(
    cursoId: Types.ObjectId,
    pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    // Desestructurar parámetros de paginación con valores predeterminados.
    const { limit, offset } = pagination || { limit: 10, offset: 0 };

    // Buscar órdenes que incluyan el curso especificado.
    return this.ordenModel
      .find({ 'cursos.cursoId': cursoId }) // Filtrar por cursoId en la lista de cursos.
      .limit(limit) // Limitar el número de resultados.
      .skip(offset) // Omitir un número específico de resultados para paginación.
      .exec(); // Ejecutar la consulta.
  }

  /**
   * Busca órdenes asociadas a un usuario específico.
   *
   * Este método permite filtrar órdenes en base al usuario y paginar los resultados.
   *
   * @param usuarioId ID del usuario a buscar en las órdenes.
   * @param pagination Parámetros de paginación (límite y desplazamiento).
   * @returns Lista de órdenes asociadas al usuario especificado.
   */
  async findByUsuarioId(
    usuarioId: Types.ObjectId,
    pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    // Desestructurar parámetros de paginación con valores predeterminados.
    const { limit, offset } = pagination || { limit: 10, offset: 0 };

    // Buscar órdenes asociadas al usuario especificado.
    return this.ordenModel
      .find({ usuarioId }) // Filtrar por usuarioId.
      .limit(limit) // Limitar el número de resultados.
      .skip(offset) // Omitir un número específico de resultados para paginación.
      .exec(); // Ejecutar la consulta.
  }
}
