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
    @InjectModel(Orden.name) private readonly ordenModel: Model<Orden>,
    @InjectModel(Curso.name) private readonly cursoModel: Model<Curso>,
    // private readonly cursoService: CursoService,
  ) {
    super(ordenModel);
  }

  async _create(
    listCursos: Types.ObjectId[],
    userId: Types.ObjectId,
  ): Promise<Orden> {
    // 1. Recuperar cursos válidos (no eliminados)
    // const arraycurso = await this.cursoService.findManyByIds(listCursos.cursosIds);

    const cursoObjectIds = listCursos.map((id) => new Types.ObjectId(id));

    const cursosArray: Curso[] = await this.cursoModel
      .find({
        _id: { $in: cursoObjectIds },
        deleted: false,
      })
      .exec();

    // Validar que se encontraron todos los cursos solicitados
    if (cursosArray.length !== listCursos.length) {
      throw new NotFoundException(
        'Algunos cursos no fueron encontrados o están eliminados.',
      );
    }

    // 2. Mapear los cursos para adaptarlos al subdocumento OrdenCursoItem
    const cursos: OrdenCursoItem[] = cursosArray.map((curso) => ({
      cursoId: new Types.ObjectId(curso._id),
      precio: curso.precio || 0,
      courseTitle: curso.courseTitle,
      descuento: curso.descuento || 0,
    }));

    const createOrden: CreateOrdenInput = {
      listaCursos: cursos,
      usuarioId: userId,
    };
    return super.create(createOrden, userId);
  }

  // findVentasPorCurso no ha sido Testeada
  async findByCursoId(
    cursoId: Types.ObjectId,
    pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    const { limit, offset } = pagination || { limit: 10, offset: 0 };
    return this.ordenModel
      .find({ 'cursos.cursoId': cursoId })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async findByUsuarioId(
    usuarioId: Types.ObjectId,
    pagination?: PaginationArgs,
  ): Promise<Orden[]> {
    const { limit, offset } = pagination || { limit: 10, offset: 0 };

    return this.ordenModel.find({ usuarioId }).limit(limit).skip(offset).exec();
  }
}
