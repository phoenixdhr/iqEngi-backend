import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Orden } from '../entities/orden.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { OrdenCursoItem } from '../entities/ordenCursoItem.entity';
import { CreateOrdenCursoItemDto } from '../dtos/create-ordenCursoItem.input';
import { BaseArrayService2 } from 'src/common/services/base-array.service2';

@Injectable()
export class OrdenArrayCursoService extends BaseArrayService2<
  Orden,
  CreateOrdenCursoItemDto,
  'cursoId',
  OrdenCursoItem
> {
  constructor(
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>,
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,
    // private readonly cursoService: CursoService,
  ) {
    super(ordenModel, 'cursoId');
  }
  //CreateOrdenCursoItemDto
  // async _pushToArray(
  //   idOrden: Types.ObjectId,
  //   idUser: Types.ObjectId,
  //   listaCursosId: Types.ObjectId[],
  //   arrayName: keyof Orden = 'listaCursos',
  // ): Promise<Orden> {
  //   const cursoObjectIds = listaCursosId.map((id) => new Types.ObjectId(id));

  //   const cursosArray: Curso[] = await this.cursoModel
  //     .find({
  //       _id: { $in: cursoObjectIds },
  //       deleted: false,
  //     })
  //     .exec();

  //   // Validar que se encontraron todos los cursos solicitados
  //   if (cursosArray.length !== listaCursosId.length) {
  //     throw new NotFoundException(
  //       'Algunos cursos no fueron encontrados o están eliminados.',
  //     );
  //   }

  //   // 2. Mapear los cursos para adaptarlos al subdocumento OrdenCursoItem
  //   const cursos: CreateOrdenCursoItemDto[] = cursosArray.map((curso) => ({
  //     cursoId: new Types.ObjectId(curso._id),
  //     precio: curso.precio || 0,
  //     courseTitle: curso.courseTitle,
  //     descuento: curso.descuento || 0,
  //   }));

  //   // Actualizar la orden usando $push con $each para agregar los nuevos elementos al array
  //   const updateOrden: Orden = await this.model
  //     .findByIdAndUpdate(
  //       idOrden,
  //       {
  //         $push: {
  //           [arrayName]: { $each: cursos },
  //         },
  //         // Opcional: agregar campos de auditoría si es necesario
  //         // $set: { updatedBy: idUser, updatedAt: new Date() }
  //       },
  //       { new: true },
  //     )
  //     .exec();

  //   if (!updateOrden) {
  //     throw new NotFoundException('Orden no encontrada');
  //   }

  //   return updateOrden;
  // }

  async _pushToArray(
    idOrden: Types.ObjectId,
    idUser: Types.ObjectId,
    listaCursosId: Types.ObjectId[],
    arrayName: keyof Orden = 'listaCursos',
  ): Promise<Orden> {
    const cursoObjectIds = listaCursosId.map((id) => new Types.ObjectId(id));

    // Obtener la orden actual
    const orden = await this.model.findById(idOrden).exec();
    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Filtrar los cursos que ya están en listaCursos
    const cursosExistentes = new Set(
      orden.listaCursos.map((curso) => curso.cursoId.toString()),
    );
    const cursosAAgregarIds = cursoObjectIds.filter(
      (id) => !cursosExistentes.has(id.toString()),
    );

    if (cursosAAgregarIds.length === 0) {
      throw new Error('Todos los cursos ya están en la orden');
    }

    // Validar que los cursos existen y no están eliminados
    const cursosAAgregar = await this.cursoModel
      .find({
        _id: { $in: cursosAAgregarIds },
        deleted: false,
      })
      .exec();

    if (cursosAAgregar.length !== cursosAAgregarIds.length) {
      throw new NotFoundException(
        'Algunos cursos no fueron encontrados o están eliminados.',
      );
    }

    // Mapear los cursos para adaptarlos al subdocumento OrdenCursoItem
    const cursosItems: CreateOrdenCursoItemDto[] = cursosAAgregar.map(
      (curso) => ({
        cursoId: new Types.ObjectId(curso._id),
        precio: curso.precio || 0,
        courseTitle: curso.courseTitle,
        descuento: curso.descuento || 0,
      }),
    );

    // Combinar listaCursos existente con los nuevos cursos
    const updatedListaCursos = [...orden.listaCursos, ...cursosItems];

    console.log('updatedListaCursos:::::::::::::::::::', updatedListaCursos);

    // Recalcular montoTotal basado en la lista actualizada
    const montoTotal = updatedListaCursos.reduce(
      (acc, curso) => acc + curso.precio * (1 - curso.descuento / 100),
      0,
    );

    // Actualizar la orden en la base de datos
    const updatedOrden = await this.model
      .findByIdAndUpdate(
        idOrden,
        {
          $set: {
            [arrayName]: updatedListaCursos,
            montoTotal,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedOrden) {
      throw new NotFoundException('Orden no encontrada');
    }

    return updatedOrden;
  }

  // async pulltoArray(
  //   idOrden: Types.ObjectId,
  //   idCurso: Types.ObjectId,
  //   idUser: Types.ObjectId,
  //   arrayName: keyof Orden = 'listaCursos',
  // ): Promise<OrdenCursoItem> {
  //   await super.softDelete(idOrden, idCurso, idUser, arrayName);
  //   return super.pullIfDeleted(idOrden, idCurso, arrayName);
  // }

  // async _pullFromArray(
  //   idOrden: Types.ObjectId,
  //   listaCursosId: Types.ObjectId[],
  //   arrayName: keyof Orden = 'listaCursos',
  // ): Promise<Orden> {
  //   console.log('11111111111111111111111111111111111111');

  //   // Convertir la lista de IDs a ObjectId si no lo están
  //   const cursoObjectIds = listaCursosId.map((id) => new Types.ObjectId(id));
  //   console.log('2222222222222222222222222222222222222222');
  //   // Actualizar la orden usando $pull con $in para eliminar los elementos
  //   const updateOrden: Orden = await this.model
  //     .findByIdAndUpdate(
  //       idOrden,
  //       {
  //         $pull: {
  //           [arrayName]: {
  //             cursoId: { $in: cursoObjectIds }, // Eliminar elementos cuyo cursoId esté en la lista
  //           },
  //         },
  //         // Opcional: agregar campos de auditoría si es necesario
  //         // $set: { updatedBy: idUser, updatedAt: new Date() }
  //       },
  //       { new: true },
  //     )
  //     .exec();

  //   if (!updateOrden) {
  //     throw new NotFoundException('Orden no encontrada');
  //   }
  //   console.log('updateOrden:::::::::::::::::::', updateOrden);

  //   return updateOrden;
  // }

  async _pullFromArray(
    idOrden: Types.ObjectId,
    listaCursosId: Types.ObjectId[],
    arrayName: keyof Orden = 'listaCursos',
  ): Promise<Orden> {
    // Convertir la lista de IDs a ObjectId si no lo están
    const cursoObjectIds = listaCursosId.map((id) => new Types.ObjectId(id));

    // Obtener la orden actual
    const orden = await this.model.findById(idOrden).exec();
    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Filtrar los cursos que no serán eliminados
    const updatedListaCursos = orden.listaCursos.filter(
      (curso) => !cursoObjectIds.some((id) => id.equals(curso.cursoId)),
    );

    // Recalcular montoTotal basado en la lista actualizada
    const montoTotal = updatedListaCursos.reduce(
      (acc, curso) => acc + curso.precio * (1 - curso.descuento / 100),
      0,
    );

    // Actualizar la orden
    const updatedOrden = await this.model
      .findByIdAndUpdate(
        idOrden,
        {
          $set: {
            [arrayName]: updatedListaCursos,
            montoTotal,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedOrden) {
      throw new NotFoundException('Orden no encontrada');
    }

    return updatedOrden;
  }
}
