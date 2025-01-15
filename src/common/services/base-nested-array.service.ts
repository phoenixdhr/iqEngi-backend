import { Model, Types, UpdateQuery } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IdInterface } from '../interfaces/id.interface';

/* En el siguiente ejemplo el codigo permitiria agregar y modificar lecciones
{
  "_id": "1",
  "nombre": "Curso de Programación",
  "modulos": [
    {
      "_id": "101",
      "titulo": "Introducción",
      "lecciones": [
        { "_id": "1001", "nombre": "Bienvenida", "deleted": false },
        { "_id": "1002", "nombre": "Primeros pasos", "deleted": true }
      ]
    }
  ]
} */

export abstract class BaseNestedArrayService<
  ModeloGeneral,
  DtoCrearSubSubModelo,
  DtoActualizarSubSubModelo,
  SubModelo extends IdInterface,
  SubSubModelo extends IdInterface,
> {
  constructor(
    protected readonly modelo: Model<ModeloGeneral>, // p.ej., Cuestionario
    protected readonly subModelo: Model<SubModelo>, // p.ej., Pregunta
    protected readonly subSubModelo: Model<SubSubModelo>, // p.ej., Opción
  ) {}

  /**
   * Valida si el campo es un arreglo en el esquema.
   * @param nombreCampoArreglo - El nombre del campo a validar.
   * @throws InternalServerErrorException si el campo no existe o no es un arreglo.
   */
  private validarCampoArreglo<CampoArregloGeneral extends keyof ModeloGeneral>(
    nombreCampoArreglo: CampoArregloGeneral,
  ): void {
    const rutaEsquema = this.modelo.schema.path(String(nombreCampoArreglo));

    if (!rutaEsquema) {
      throw new InternalServerErrorException(
        `El campo "${String(nombreCampoArreglo)}" no existe en el esquema. 3`,
      );
    }

    if (rutaEsquema.instance !== 'Array') {
      throw new InternalServerErrorException(
        `El campo "${String(nombreCampoArreglo)}" no es un arreglo.`,
      );
    }
  }

  /**
   * Valida si el campo es un arreglo en el esquema del submodelo.
   * @param nombreCampoSubArreglo - El nombre del campo a validar en el submodelo.
   * @throws InternalServerErrorException si el campo no existe o no es un arreglo en el submodelo.
   */
  private validarCampoSubArreglo<CampoArregloSubModelo extends keyof SubModelo>(
    nombreCampoSubArreglo: CampoArregloSubModelo,
  ): void {
    const rutaEsquema = this.subModelo.schema.path(
      String(nombreCampoSubArreglo),
    );

    if (!rutaEsquema) {
      throw new InternalServerErrorException(
        `El campo "${String(
          nombreCampoSubArreglo,
        )}" no existe en el esquema del submodelo.`,
      );
    }

    if (rutaEsquema.instance !== 'Array') {
      throw new InternalServerErrorException(
        `El campo "${String(
          nombreCampoSubArreglo,
        )}" no es un arreglo en el submodelo.`,
      );
    }
  }

  //#region create

  /**
   * Añade un elemento al arreglo dentro de un subdocumento.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento donde se agregará el elemento.
   * @param idCreadoPor - ID del usuario que realiza la creación.
   * @param dtoCrearSubSubModelo - Datos del subsubmodelo a crear.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El nuevo elemento añadido al arreglo del subdocumento.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento.
   */
  async pushToNestedArray<
    K extends keyof ModeloGeneral,
    L extends keyof SubModelo,
  >(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idCreadoPor: Types.ObjectId,
    dtoCrearSubSubModelo: DtoCrearSubSubModelo,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    this.validarCampoArreglo(nombreCampoArreglo);
    const nombreCampo = String(nombreCampoArreglo);
    const nombreSubCampo = String(nombreCampoSubArreglo);

    const nuevoSubSubModelo = {
      ...dtoCrearSubSubModelo,
      createdBy: idCreadoPor,
    };

    const actualizacion: UpdateQuery<ModeloGeneral> = {
      $push: {
        [`${nombreCampo}.$[elem].${nombreSubCampo}`]: nuevoSubSubModelo,
      },
    } as UpdateQuery<ModeloGeneral>;

    const documentoActualizado = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, actualizacion, {
        new: true,
        arrayFilters: [{ 'elem._id': idSubDocumento }],
      })
      .exec();

    if (!documentoActualizado) {
      throw new NotFoundException(
        `No se encontró el documento con ID "${idDocumento}" o el subdocumento con ID "${idSubDocumento}"`,
      );
    }

    const arregloSubDocumentos = documentoActualizado[
      nombreCampo
    ] as SubModelo[];
    const subDocumentoActualizado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumentoActualizado) {
      throw new NotFoundException(
        `No se encontró el subdocumento con ID "${idSubDocumento}"`,
      );
    }

    const subSubArreglo = subDocumentoActualizado[
      nombreSubCampo
    ] as SubSubModelo[];
    const nuevoElemento = subSubArreglo[subSubArreglo.length - 1];

    return nuevoElemento;
  }

  //#endregion

  //#region find

  /**
   * Recupera un subsubdocumento específico por su ID dentro de un subdocumento y documento principal.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param idSubSubDocumento - ID del subsubdocumento a buscar.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El subsubdocumento encontrado.
   * @throws NotFoundException si no se encuentra el documento, subdocumento o subsubdocumento, o si está eliminado.
   */
  async findById<K extends keyof ModeloGeneral, L extends keyof SubModelo>(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idSubSubDocumento: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    const subSubDocumento = await this.findByIdAll_IncludeDeleted(
      idDocumento,
      idSubDocumento,
      idSubSubDocumento,
      nombreCampoArreglo,
      nombreCampoSubArreglo,
    );

    if (subSubDocumento.deleted) {
      throw new NotFoundException(
        `El subsubdocumento ya fue eliminado "${idSubSubDocumento}"`,
      );
    }

    return subSubDocumento;
  }

  /**
   * Recupera un subsubdocumento específico por su ID dentro de un subdocumento y documento principal, incluyendo eliminados.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param idSubSubDocumento - ID del subsubdocumento a buscar.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El subsubdocumento encontrado.
   * @throws NotFoundException si no se encuentra el documento, subdocumento o subsubdocumento.
   */
  async findByIdAll_IncludeDeleted<
    K extends keyof ModeloGeneral,
    L extends keyof SubModelo,
  >(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idSubSubDocumento: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    const documento = await this.modelo.findById(idDocumento).exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento con ID "${idDocumento}" no encontrado`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);

    const arregloSubDocumentos = documento[nombreCampoArreglo] as SubModelo[];
    const subDocumento = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumento) {
      throw new NotFoundException(
        `Subdocumento con ID "${idSubDocumento}" no encontrado en el documento con ID "${idDocumento}"`,
      );
    }

    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const subSubArreglo = subDocumento[nombreCampoSubArreglo] as SubSubModelo[];
    const subSubDocumento = subSubArreglo.find(
      (subSubDoc) => String(subSubDoc._id) === String(idSubSubDocumento),
    );

    if (!subSubDocumento) {
      throw new NotFoundException(
        `SubSubdocumento con ID "${idSubSubDocumento}" no encontrado`,
      );
    }

    return subSubDocumento;
  }

  /**
   * Recupera todos los subsubdocumentos eliminados lógicamente de un subdocumento dentro de un documento principal.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento que contiene los subsubdocumentos.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns Una lista de subsubdocumentos eliminados lógicamente.
   * @throws NotFoundException si no se encuentra el documento, el subdocumento o no hay subsubdocumentos eliminados.
   */
  async findSoftDeleted<
    K extends keyof ModeloGeneral,
    L extends keyof SubModelo,
  >(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo[]> {
    const documento = await this.modelo.findById(idDocumento).exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento con ID "${idDocumento}" no encontrado`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);

    const arregloSubDocumentos = documento[nombreCampoArreglo] as SubModelo[];
    const subDocumento = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumento) {
      throw new NotFoundException(
        `Subdocumento con ID "${idSubDocumento}" no encontrado en el documento con ID "${idDocumento}"`,
      );
    }

    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const subSubArreglo = subDocumento[nombreCampoSubArreglo] as SubSubModelo[];
    const subSubDocumentosEliminados = subSubArreglo.filter(
      (subSubDoc) => subSubDoc.deleted === true,
    );

    if (subSubDocumentosEliminados.length === 0) {
      throw new NotFoundException(
        `No hay subsubdocumentos marcados como eliminados en el subdocumento con ID "${idSubDocumento}"`,
      );
    }

    return subSubDocumentosEliminados;
  }

  //#endregion

  //#region update

  /**
   * Actualiza un subsubdocumento dentro de un subdocumento y documento principal.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param idSubSubDocumento - ID del subsubdocumento.
   * @param idActualizadoPor - ID del usuario que realiza la actualización.
   * @param datosActualizacion - Datos para actualizar el subsubdocumento.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El subsubdocumento actualizado.
   * @throws NotFoundException si no se encuentra el documento, subdocumento o subsubdocumento.
   */
  async updateInNestedArray<
    K extends keyof ModeloGeneral,
    L extends keyof SubModelo,
  >(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idSubSubDocumento: Types.ObjectId,
    idActualizadoPor: Types.ObjectId,
    datosActualizacion: DtoActualizarSubSubModelo,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    const subSubDocumentoAntes = await this.findById(
      idDocumento,
      idSubDocumento,
      idSubSubDocumento,
      nombreCampoArreglo,
      nombreCampoSubArreglo,
    );

    if (subSubDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subsubdocumento ya fue eliminado "${idSubSubDocumento}"`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);
    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const nombreCampo = String(nombreCampoArreglo);
    const nombreSubCampo = String(nombreCampoSubArreglo);

    const camposActualizacion: Record<
      string,
      string | number | Types.ObjectId | boolean
    > = {};

    for (const [clave, valor] of Object.entries(datosActualizacion)) {
      camposActualizacion[
        `${nombreCampo}.$[elem1].${nombreSubCampo}.$[elem2].${clave}`
      ] = valor;
    }

    camposActualizacion[
      `${nombreCampo}.$[elem1].${nombreSubCampo}.$[elem2].updatedBy`
    ] = idActualizadoPor;

    const consultaActualizacion: UpdateQuery<ModeloGeneral> = {
      $set: camposActualizacion,
    };

    const documento = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, consultaActualizacion, {
        new: true,
        arrayFilters: [
          { 'elem1._id': idSubDocumento },
          { 'elem2._id': idSubSubDocumento },
        ],
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento con ID "${idDocumento}" no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];
    const subDocumentoActualizado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumentoActualizado) {
      throw new NotFoundException(
        `Subdocumento con ID "${idSubDocumento}" no encontrado`,
      );
    }

    const subSubArreglo = subDocumentoActualizado[
      nombreSubCampo
    ] as SubSubModelo[];
    const subSubDocumentoActualizado = subSubArreglo.find(
      (subSubDoc) => String(subSubDoc._id) === String(idSubSubDocumento),
    );

    return subSubDocumentoActualizado;
  }

  //#endregion

  //#region delete

  /**
   * Realiza una eliminación lógica de un subsubdocumento.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param idSubSubDocumento - ID del subsubdocumento.
   * @param idEliminadoPor - ID del usuario que realiza la eliminación.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El subsubdocumento eliminado lógicamente.
   * @throws NotFoundException si no se encuentra el documento, subdocumento o subsubdocumento.
   */
  async softDelete<K extends keyof ModeloGeneral, L extends keyof SubModelo>(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idSubSubDocumento: Types.ObjectId,
    idEliminadoPor: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    const subSubDocumentoAntes = await this.findById(
      idDocumento,
      idSubDocumento,
      idSubSubDocumento,
      nombreCampoArreglo,
      nombreCampoSubArreglo,
    );

    if (subSubDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subsubdocumento ya fue eliminado "${idSubSubDocumento}"`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);
    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const nombreCampo = String(nombreCampoArreglo);
    const nombreSubCampo = String(nombreCampoSubArreglo);

    const camposActualizacion: Record<
      string,
      string | number | Types.ObjectId | boolean
    > = {};

    camposActualizacion[
      `${nombreCampo}.$[elem1].${nombreSubCampo}.$[elem2].deleted`
    ] = true;
    camposActualizacion[
      `${nombreCampo}.$[elem1].${nombreSubCampo}.$[elem2].deletedBy`
    ] = idEliminadoPor;

    const consultaActualizacion: UpdateQuery<ModeloGeneral> = {
      $set: camposActualizacion,
    };

    const documento = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, consultaActualizacion, {
        new: true,
        arrayFilters: [
          { 'elem1._id': idSubDocumento },
          { 'elem2._id': idSubSubDocumento },
        ],
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento con ID "${idDocumento}" no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];
    const subDocumentoActualizado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumentoActualizado) {
      throw new NotFoundException(
        `Subdocumento con ID "${idSubDocumento}" no encontrado`,
      );
    }

    const subSubArreglo = subDocumentoActualizado[
      nombreSubCampo
    ] as SubSubModelo[];
    const subSubDocumentoEliminado = subSubArreglo.find(
      (subSubDoc) => String(subSubDoc._id) === String(idSubSubDocumento),
    );

    return subSubDocumentoEliminado;
  }

  //#endregion

  //#region restore

  /**
   * Restaura un subsubdocumento eliminado lógicamente.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param idSubSubDocumento - ID del subsubdocumento.
   * @param idRestauradoPor - ID del usuario que realiza la restauración.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El subsubdocumento restaurado.
   * @throws NotFoundException si no se encuentra el documento, subdocumento o subsubdocumento, o si no está eliminado.
   */
  async restore<K extends keyof ModeloGeneral, L extends keyof SubModelo>(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idSubSubDocumento: Types.ObjectId,
    idRestauradoPor: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    const subSubDocumento = await this.findByIdAll_IncludeDeleted(
      idDocumento,
      idSubDocumento,
      idSubSubDocumento,
      nombreCampoArreglo,
      nombreCampoSubArreglo,
    );

    if (!subSubDocumento.deleted) {
      throw new NotFoundException(
        `El subsubdocumento ya fue restaurado "${idSubSubDocumento}"`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);
    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const nombreCampo = String(nombreCampoArreglo);
    const nombreSubCampo = String(nombreCampoSubArreglo);

    const camposActualizacion: Record<
      string,
      string | number | Types.ObjectId | boolean
    > = {};

    camposActualizacion[
      `${nombreCampo}.$[elem1].${nombreSubCampo}.$[elem2].deleted`
    ] = false;
    camposActualizacion[
      `${nombreCampo}.$[elem1].${nombreSubCampo}.$[elem2].updatedBy`
    ] = idRestauradoPor;

    const consultaActualizacion: UpdateQuery<ModeloGeneral> = {
      $set: camposActualizacion,
    };

    const documento = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, consultaActualizacion, {
        new: true,
        arrayFilters: [
          { 'elem1._id': idSubDocumento },
          { 'elem2._id': idSubSubDocumento },
        ],
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento con ID "${idDocumento}" no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];
    const subDocumentoActualizado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumentoActualizado) {
      throw new NotFoundException(
        `Subdocumento con ID "${idSubDocumento}" no encontrado`,
      );
    }

    const subSubArreglo = subDocumentoActualizado[
      nombreSubCampo
    ] as SubSubModelo[];
    const subSubDocumentoRestaurado = subSubArreglo.find(
      (subSubDoc) => String(subSubDoc._id) === String(idSubSubDocumento),
    );

    return subSubDocumentoRestaurado;
  }

  //#endregion

  //#region hardDelete

  /**
   * Elimina definitivamente un subsubdocumento que ha sido previamente marcado como eliminado.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param idSubSubDocumento - ID del subsubdocumento.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns El subsubdocumento eliminado definitivamente.
   * @throws NotFoundException si no se encuentra el documento, subdocumento o subsubdocumento, o si no está marcado como eliminado.
   */
  async pullIfDeleted<K extends keyof ModeloGeneral, L extends keyof SubModelo>(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idSubSubDocumento: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo> {
    const subSubDocumentoAntes = await this.findByIdAll_IncludeDeleted(
      idDocumento,
      idSubDocumento,
      idSubSubDocumento,
      nombreCampoArreglo,
      nombreCampoSubArreglo,
    );

    if (!subSubDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subsubdocumento "${idSubSubDocumento}" debe estar marcado como eliminado (deleted: true) para eliminarse`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);
    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const nombreCampo = String(nombreCampoArreglo);
    const nombreSubCampo = String(nombreCampoSubArreglo);

    const actualizacion = {
      $pull: {
        [`${nombreCampo}.$[elem1].${nombreSubCampo}`]: {
          _id: idSubSubDocumento,
        },
      },
    } as UpdateQuery<ModeloGeneral>;

    const documentoActualizado = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, actualizacion, {
        new: true,
        arrayFilters: [{ 'elem1._id': idSubDocumento }],
      })
      .exec();

    if (!documentoActualizado) {
      throw new NotFoundException(
        `No se pudo actualizar el documento con ID "${idDocumento}"`,
      );
    }

    return subSubDocumentoAntes;
  }

  /**
   * Elimina permanentemente todos los subsubdocumentos que han sido marcados como eliminados en un subdocumento.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreCampoSubArreglo - Nombre del campo arreglo en el subdocumento.
   * @returns Un array de subsubdocumentos que fueron eliminados.
   * @throws NotFoundException si no se encuentran subsubdocumentos marcados como eliminados.
   */
  async pullAllDeleted<
    K extends keyof ModeloGeneral,
    L extends keyof SubModelo,
  >(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreCampoSubArreglo: L,
  ): Promise<SubSubModelo[]> {
    this.validarCampoArreglo(nombreCampoArreglo);
    this.validarCampoSubArreglo(nombreCampoSubArreglo);

    const nombreCampo = String(nombreCampoArreglo);
    const nombreSubCampo = String(nombreCampoSubArreglo);

    const documento = await this.modelo.findById(idDocumento).exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento con ID "${idDocumento}" no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];

    const subDocumento = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );

    if (!subDocumento) {
      throw new NotFoundException(
        `Subdocumento con ID "${idSubDocumento}" no encontrado en el documento con ID "${idDocumento}"`,
      );
    }

    const subSubArreglo = subDocumento[nombreSubCampo] as SubSubModelo[];

    const elementosEliminados = subSubArreglo.filter(
      (subSubDoc) => subSubDoc.deleted === true,
    );

    if (elementosEliminados.length === 0) {
      throw new NotFoundException(
        `No hay subsubdocumentos marcados como eliminados en el subdocumento con ID "${idSubDocumento}"`,
      );
    }

    const actualizacion = {
      $pull: {
        [`${nombreCampo}.$[elem1].${nombreSubCampo}`]: { deleted: true },
      },
    } as UpdateQuery<ModeloGeneral>;

    const documentoActualizado = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, actualizacion, {
        new: true,
        arrayFilters: [{ 'elem1._id': idSubDocumento }],
      })
      .exec();

    if (!documentoActualizado) {
      throw new NotFoundException(
        `No se pudo actualizar el documento con ID "${idDocumento}"`,
      );
    }

    return elementosEliminados;
  }

  //#endregion
}
