// import { BaseNestedArrayService } from 'src/common/services/base-nested-array.service';
// import { Unidad } from '../entities/unidad.entity';
// import { Modulo } from '../entities/modulo.entity';
// import { Curso } from '../entities/curso.entity';
// import { CreateUnidadInput } from '../dtos/unidad-dtos/create-unidad.input';
// import { UpdateUnidadInput } from '../dtos/unidad-dtos/update-unidad.input';
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';

// @Injectable()
// export class UnidadService extends BaseNestedArrayService<
//   Curso,
//   CreateUnidadInput,
//   UpdateUnidadInput,
//   Modulo,
//   Unidad
// > {
//   constructor(
//     @InjectModel(Curso.name)
//     private readonly cursoModel: Model<Curso>, // Modelo de Curso en MongoDB.
//     @InjectModel(Modulo.name)
//     private readonly moduloModel: Model<Modulo>, // Modelo de Modulo en MongoDB.
//     @InjectModel(Unidad.name)
//     private readonly unidadModel: Model<Unidad>, // Modelo de Unidad en MongoDB.
//   ) {
//     super(cursoModel, moduloModel, unidadModel); // Inicializa la clase base con los modelos.
//   }

//   /**
//    * Añade una nueva opción al array `unidades` de una pregunta.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta a la que se agregará la opción.
//    * @param element Datos de la nueva opción.
//    * @param arrayName Nombre del array donde se almacenan las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se almacenan las unidades (por defecto: 'unidades').
//    * @returns La opción agregada.
//    */
//   async pushToNestedArray(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     createdBy: Types.ObjectId,
//     element: CreateUnidadInput,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad> {
//     return super.pushToNestedArray(
//       idCuestionario,
//       idPregunta,
//       createdBy,
//       element,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Recupera una opción específica dentro del array `unidades` de una pregunta.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta que contiene la opción.
//    * @param idOpcion ID de la opción a buscar.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns La opción encontrada.
//    */
//   async findById(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     idOpcion: Types.ObjectId,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad> {
//     return super.findById(
//       idCuestionario,
//       idPregunta,
//       idOpcion,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Obtiene todas las unidades eliminadas lógicamente de una pregunta específica.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta que contiene las unidades.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns Una lista de unidades eliminadas lógicamente.
//    */
//   async findSoftDeleted(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad[]> {
//     return super.findSoftDeleted(
//       idCuestionario,
//       idPregunta,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Actualiza una opción existente dentro del array `unidades` de una pregunta.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta que contiene la opción.
//    * @param idOpcion ID de la opción a actualizar.
//    * @param idUser ID del usuario que realiza la operación.
//    * @param updateOpcionInput Datos para actualizar la opción.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns La opción actualizada.
//    */
//   async updateInNestedArray(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     idOpcion: Types.ObjectId,
//     idUser: Types.ObjectId,
//     updateOpcionInput: UpdateUnidadInput,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad> {
//     return super.updateInNestedArray(
//       idCuestionario,
//       idPregunta,
//       idOpcion,
//       idUser,
//       updateOpcionInput,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Elimina lógicamente una opción dentro del array `unidades` de una pregunta.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta que contiene la opción.
//    * @param idOpcion ID de la opción a eliminar.
//    * @param idUser ID del usuario que realiza la operación.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns La opción eliminada.
//    */
//   async softDelete(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     idOpcion: Types.ObjectId,
//     idUser: Types.ObjectId,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad> {
//     return super.softDelete(
//       idCuestionario,
//       idPregunta,
//       idOpcion,
//       idUser,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Restaura una opción eliminada lógicamente.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta que contiene la opción.
//    * @param idOpcion ID de la opción a restaurar.
//    * @param idUser ID del usuario que realiza la operación.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns La opción restaurada.
//    */
//   async restore(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     idOpcion: Types.ObjectId,
//     idUser: Types.ObjectId,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad> {
//     return super.restore(
//       idCuestionario,
//       idPregunta,
//       idOpcion,
//       idUser,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Elimina permanentemente una opción marcada como eliminada lógicamente.
//    *
//    * @param idCuestionario ID del curso que contiene la pregunta.
//    * @param idPregunta ID de la pregunta que contiene la opción.
//    * @param idOpcion ID de la opción a eliminar permanentemente.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns La opción eliminada permanentemente.
//    */
//   async pullIfDeleted(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     idOpcion: Types.ObjectId,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad> {
//     return super.pullIfDeleted(
//       idCuestionario,
//       idPregunta,
//       idOpcion,
//       arrayName,
//       subArrayName,
//     );
//   }

//   /**
//    * Elimina permanentemente todas las unidades marcadas como eliminadas lógicamente.
//    *
//    * @param idCuestionario ID del curso.
//    * @param idPregunta ID de la pregunta.
//    * @param arrayName Nombre del array donde se encuentran las modulos (por defecto: 'modulos').
//    * @param subArrayName Nombre del subarray donde se encuentran las unidades (por defecto: 'unidades').
//    * @returns Una lista de unidades eliminadas permanentemente.
//    */
//   async pullAllDeleted(
//     idCuestionario: Types.ObjectId,
//     idPregunta: Types.ObjectId,
//     arrayName: keyof Curso = 'modulos',
//     subArrayName: keyof Modulo = 'unidades',
//   ): Promise<Unidad[]> {
//     return super.pullAllDeleted(
//       idCuestionario,
//       idPregunta,
//       arrayName,
//       subArrayName,
//     );
//   }
// }

import { BaseNestedArrayService } from 'src/common/services/base-nested-array.service';
import { Unidad } from '../entities/unidad.entity';
import { Modulo } from '../entities/modulo.entity';
import { Curso } from '../entities/curso.entity';
import { CreateUnidadInput } from '../dtos/unidad-dtos/create-unidad.input';
import { UpdateUnidadInput } from '../dtos/unidad-dtos/update-unidad.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UnidadService extends BaseNestedArrayService<
  Curso,
  CreateUnidadInput,
  UpdateUnidadInput,
  Modulo,
  Unidad
> {
  constructor(
    @InjectModel(Curso.name)
    private readonly cursoModel: Model<Curso>, // Modelo de la entidad Curso en MongoDB.
    @InjectModel(Modulo.name)
    private readonly moduloModel: Model<Modulo>, // Modelo de la entidad Modulo en MongoDB.
    @InjectModel(Unidad.name)
    private readonly unidadModel: Model<Unidad>, // Modelo de la entidad Unidad en MongoDB.
  ) {
    super(cursoModel, moduloModel, unidadModel); // Inicializa la clase base con los modelos.
  }

  /**
   * Agrega una nueva unidad al array `unidades` dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo donde se agregará la unidad.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nuevaUnidad Datos de la nueva unidad a agregar.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad agregada.
   */
  async pushToNestedArray(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nuevaUnidad: CreateUnidadInput,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.pushToNestedArray(
      cursoId,
      moduloId,
      usuarioId,
      nuevaUnidad,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Recupera una unidad específica dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a buscar.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad encontrada.
   */
  async _findById(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.findById(
      cursoId,
      moduloId,
      unidadId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Obtiene todas las unidades eliminadas lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene las unidades.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns Una lista de unidades eliminadas lógicamente.
   */
  async findSoftDeleted(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad[]> {
    return super.findSoftDeleted(
      cursoId,
      moduloId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Actualiza una unidad existente dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a actualizar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param datosActualizados Datos actualizados para la unidad.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad actualizada.
   */
  async updateInNestedArray(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    datosActualizados: UpdateUnidadInput,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.updateInNestedArray(
      cursoId,
      moduloId,
      unidadId,
      usuarioId,
      datosActualizados,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Elimina lógicamente una unidad dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a eliminar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad eliminada lógicamente.
   */
  async softDelete(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.softDelete(
      cursoId,
      moduloId,
      unidadId,
      usuarioId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Restaura una unidad eliminada lógicamente dentro del array `unidades` de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a restaurar.
   * @param usuarioId ID del usuario que realiza la operación.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad restaurada.
   */
  async restore(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.restore(
      cursoId,
      moduloId,
      unidadId,
      usuarioId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Elimina permanentemente una unidad marcada como eliminada lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo que contiene la unidad.
   * @param unidadId ID de la unidad a eliminar permanentemente.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns La unidad eliminada permanentemente.
   */
  async pullIfDeleted(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    unidadId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad> {
    return super.pullIfDeleted(
      cursoId,
      moduloId,
      unidadId,
      nombreArray,
      nombreSubArray,
    );
  }

  /**
   * Elimina permanentemente todas las unidades marcadas como eliminadas lógicamente dentro de un módulo.
   *
   * @param cursoId ID del curso que contiene el módulo.
   * @param moduloId ID del módulo.
   * @param nombreArray Nombre del array principal (por defecto: 'modulos').
   * @param nombreSubArray Nombre del array secundario (por defecto: 'unidades').
   * @returns Una lista de unidades eliminadas permanentemente.
   */
  async pullAllDeleted(
    cursoId: Types.ObjectId,
    moduloId: Types.ObjectId,
    nombreArray: keyof Curso = 'modulos',
    nombreSubArray: keyof Modulo = 'unidades',
  ): Promise<Unidad[]> {
    return super.pullAllDeleted(cursoId, moduloId, nombreArray, nombreSubArray);
  }
}
