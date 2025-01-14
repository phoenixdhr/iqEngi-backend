import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseArrayWithNestedArrayService } from 'src/common/services/base-array-with-nested-array.service';
import { CreateModuloInput } from '../dtos/modulo-dtos/create-modulo.input';
import { UpdateModuloInput } from '../dtos/modulo-dtos/update-modulo.input';
import { Modulo } from '../entities/modulo.entity';
import { Curso } from '../entities/curso.entity';
import { CursoService } from './curso.service';

@Injectable()
export class ModuloService extends BaseArrayWithNestedArrayService<
  Curso,
  CreateModuloInput,
  UpdateModuloInput,
  Modulo
> {
  constructor(
    @InjectModel(Curso.name)
    private readonly cursoModel: Model<Curso>, // Modelo de la entidad Curso en MongoDB.
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo de la entidad Modulo en MongoDB.
    private readonly cursoService: CursoService, // Servicio para operaciones relacionadas con los cursos.
  ) {
    super(cursoModel, moduloModel); // Inicializa la clase base con los modelos.
  }

  /**
   * Agrega un nuevo módulo al array `modulos` de un curso.
   *
   * @param cursoId ID del curso al que se agregará el módulo.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nuevoModulo Datos del nuevo módulo.
   * @param arrayNombre Nombre del array donde se almacenan los módulos (por defecto: 'modulos').
   * @returns El módulo agregado.
   */
  async pushToArray(
    cursoId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nuevoModulo: CreateModuloInput,
    arrayNombre: keyof Curso = 'modulos',
  ): Promise<Modulo> {
    const nuevoModuloCompleto: CreateModuloInput = { ...nuevoModulo, cursoId };

    return super.pushToArray(
      cursoId,
      usuarioId,
      nuevoModuloCompleto,
      arrayNombre,
    );
  }

  async findAll(cursoId: Types.ObjectId): Promise<Modulo[]> {
    const cursos = await this.cursoService.findById(cursoId);
    const cursoswithModulos = cursos.modulos.filter(
      (modulo) => !modulo.deleted,
    );
    return cursoswithModulos;
  }

  /**
   * Busca un módulo específico dentro del array `modulos` de un curso.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo a buscar.
   * @param arrayNombre Nombre del array donde se encuentran los módulos (por defecto: 'modulos').
   * @param nestedArrayNombre Nombre del array anidado dentro del módulo (por defecto: 'unidades').
   * @returns El módulo encontrado.
   */
  async findById(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    arrayNombre: keyof Curso = 'modulos',
    nestedArrayNombre: keyof Modulo = 'unidades',
  ): Promise<Modulo> {
    return super.findById(cursoId, moduloId, arrayNombre, nestedArrayNombre);
  }

  /**
   * Actualiza un módulo existente dentro del array `modulos` de un curso.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo a actualizar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param datosActualizados Datos para actualizar el módulo.
   * @param arrayNombre Nombre del array donde se encuentran los módulos (por defecto: 'modulos').
   * @param nestedArrayNombre Nombre del array anidado dentro del módulo (por defecto: 'unidades').
   * @returns El módulo actualizado.
   */
  async updateInArray(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    datosActualizados: UpdateModuloInput,
    arrayNombre: keyof Curso = 'modulos',
    nestedArrayNombre: keyof Modulo = 'unidades',
  ): Promise<Modulo> {
    return super.updateInArray(
      cursoId,
      moduloId,
      usuarioId,
      datosActualizados,
      arrayNombre,
      nestedArrayNombre,
    );
  }

  /**
   * Realiza una eliminación lógica de un módulo específico.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo a eliminar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param arrayNombre Nombre del array donde se encuentran los módulos (por defecto: 'modulos').
   * @param nestedArrayNombre Nombre del array anidado dentro del módulo (por defecto: 'unidades').
   * @returns El módulo eliminado lógicamente.
   */
  async softDelete(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    arrayNombre: keyof Curso = 'modulos',
    nestedArrayNombre: keyof Modulo = 'unidades',
  ): Promise<Modulo> {
    return super.softDelete(
      cursoId,
      moduloId,
      usuarioId,
      arrayNombre,
      nestedArrayNombre,
    );
  }

  /**
   * Restaura un módulo que ha sido eliminado lógicamente.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo a restaurar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param arrayNombre Nombre del array donde se encuentran los módulos (por defecto: 'modulos').
   * @param nestedArrayNombre Nombre del array anidado dentro del módulo (por defecto: 'unidades').
   * @returns El módulo restaurado.
   */
  async restore(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    arrayNombre: keyof Curso = 'modulos',
    nestedArrayNombre: keyof Modulo = 'unidades',
  ): Promise<Modulo> {
    return super.restore(
      cursoId,
      moduloId,
      usuarioId,
      arrayNombre,
      nestedArrayNombre,
    );
  }

  /**
   * Obtiene todos los módulos eliminados lógicamente en un curso.
   *
   * @param cursoId ID del curso.
   * @returns Una lista de módulos eliminados lógicamente.
   */
  async findSoftDeleted(cursoId: Types.ObjectId): Promise<Modulo[]> {
    const curso =
      await this.cursoService.findById_WithNestedSubDocuments_ActiveOrInactive(
        cursoId,
        'modulos',
        'unidades',
        true,
      );

    // const modulosIds = curso.modulos as Types.ObjectId[];

    // // Recupera los documentos completos de los módulos eliminados.
    // const modulos = await this.moduloModel
    //   .find({
    //     _id: { $in: modulosIds },
    //   })
    //   .exec();

    return (await curso).modulos;
  }

  /**
   * Elimina permanentemente un módulo marcado como eliminado lógicamente.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo a eliminar definitivamente.
   * @param arrayNombre Nombre del array donde se encuentran los módulos (por defecto: 'modulos').
   * @returns El módulo eliminado permanentemente.
   */
  async pullIfDeleted(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    arrayNombre: keyof Curso = 'modulos',
    nestedArrayNombre: keyof Modulo = 'unidades',
  ): Promise<Modulo> {
    return super.pullIfDeleted(
      cursoId,
      moduloId,
      arrayNombre,
      nestedArrayNombre,
    );
  }

  /**
   * Elimina permanentemente todos los módulos que han sido marcados como eliminados lógicamente.
   *
   * @param cursoId ID del curso.
   * @param arrayNombre Nombre del array donde se encuentran los módulos (por defecto: 'modulos').
   * @returns Una lista de módulos eliminados permanentemente.
   */
  async pullAllDeleted(
    cursoId: Types.ObjectId,
    arrayNombre: keyof Curso = 'modulos',
  ): Promise<Modulo[]> {
    return super.pullAllDeleted(cursoId, arrayNombre);
  }
}
