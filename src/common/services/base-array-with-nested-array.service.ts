import { Model, Types, UpdateQuery } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IdInterface } from '../interfaces/id.interface';

export abstract class BaseArrayWithNestedArrayService<
  ModeloGeneral,
  Dto_Crear_SubModelo,
  Dto_Actualizar_SubmodeloInput,
  SubModelo extends IdInterface,
> {
  constructor(
    protected readonly modelo: Model<ModeloGeneral>,
    protected readonly subModelo: Model<SubModelo>,
  ) {}

  /**
   * Valida que un campo en el esquema del modelo sea un arreglo.
   * @param nombreCampoArreglo - El nombre del campo a validar.
   * @throws InternalServerErrorException si el campo no existe o no es un arreglo.
   */
  private validarCampoArreglo<CampoArregloGeneral extends keyof ModeloGeneral>(
    nombreCampoArreglo: CampoArregloGeneral,
  ): void {
    const rutaEsquema = this.modelo.schema.path(String(nombreCampoArreglo));

    if (!rutaEsquema) {
      throw new InternalServerErrorException(
        `El campo "${String(nombreCampoArreglo)}" no existe en el esquema.`,
      );
    }

    if (rutaEsquema.instance !== 'Array') {
      throw new InternalServerErrorException(
        `El campo "${String(nombreCampoArreglo)}" no es un arreglo.`,
      );
    }
  }

  //#region crear

  /**
   * Agrega un nuevo elemento a un arreglo en un documento específico.
   * @param idDocumento - ID del documento principal.
   * @param createdBy - ID del usuario que realiza la creación.
   * @param dtoCrearSubModelo - Datos del submodelo a crear.
   * @param nombreCampoArreglo - Nombre del campo que es un arreglo en el documento.
   * @returns El nuevo elemento añadido al arreglo.
   * @throws NotFoundException si no se encuentra el documento principal.
   */
  async pushToArray<K extends keyof ModeloGeneral>(
    idDocumento: Types.ObjectId,
    createdBy: Types.ObjectId,
    dtoCrearSubModelo: Dto_Crear_SubModelo,
    nombreCampoArreglo: K,
  ): Promise<SubModelo> {
    // Validar que el campo sea un arreglo
    this.validarCampoArreglo(nombreCampoArreglo);

    const nombreCampo = String(nombreCampoArreglo);

    // Definir la consulta de actualización
    const actualizacion: UpdateQuery<ModeloGeneral> = {
      $push: {
        [nombreCampo]: dtoCrearSubModelo,
      },
    } as UpdateQuery<ModeloGeneral>; // No cambiar el tipado con "as"

    // Buscar y actualizar el documento
    const documentoActualizado = await this.modelo
      .findByIdAndUpdate(
        idDocumento,
        { ...actualizacion, createdBy: createdBy },
        { new: true },
      )
      .exec();

    if (!documentoActualizado) {
      throw new NotFoundException(
        `No se encontró el documento con ID "${idDocumento}"`,
      );
    }

    const arregloDocumentos = documentoActualizado[nombreCampo] as SubModelo[];
    const nuevoElemento = arregloDocumentos[arregloDocumentos.length - 1];

    return nuevoElemento;
  }

  //#endregion

  //#region encontrar

  /**
   * Recupera un documento por su ID y filtra sus subdocumentos y subsubdocumentos basados en el estado 'deleted'.
   *
   * @param id - ID del documento principal.
   * @param subDocumentField - Nombre del campo de subdocumentos (arreglo) a filtrar (ejemplo: 'preguntas').
   * @param nestedSubDocumentField - Nombre del campo de subsubdocumentos dentro del subdocumento (ejemplo: 'opciones').
   * @param deleted - Estado 'deleted' por el cual filtrar los subdocumentos y subsubdocumentos (por defecto es false).
   *
   * @returns El documento principal con los subdocumentos y subsubdocumentos filtrados según el estado 'deleted'.
   *
   * @throws NotFoundException si el documento no existe.
   * @throws InternalServerErrorException si el subDocumentField o nestedSubDocumentField no existe en el esquema del modelo.
   */
  async findById_WithNestedSubDocuments_ActiveOrInactive(
    id: Types.ObjectId,
    subDocumentField: string,
    nestedSubDocumentField: string,
    deleted: boolean = false,
  ): Promise<ModeloGeneral> {
    // Validar que el campo de subdocumentos existe en el esquema
    //if (!this.modelo.schema.paths[subDocumentField]) {
    //  throw new InternalServerErrorException(
    //    `El campo "${subDocumentField}"no existe en el esquema del modelo ddd ${this.modelo.collection.name}`,
    //  );
    //}

    // Realizar una agregación para filtrar subdocumentos y subsubdocumentos
    const result = await this.modelo
      .aggregate([
        // Filtrar el documento principal por ID y que no esté eliminado
        { $match: { _id: id, deleted: false } },
        {
          // Filtrar los subdocumentos basados en el estado 'deleted'
          $addFields: {
            [subDocumentField]: {
              $filter: {
                input: `$${subDocumentField}`,
                as: 'subDocument',
                cond: { $eq: ['$$subDocument.deleted', deleted] },
              },
            },
          },
        },
        {
          // Filtrar los subsubdocumentos dentro de los subdocumentos
          $addFields: {
            [subDocumentField]: {
              $map: {
                input: `$${subDocumentField}`,
                as: 'subDocument',
                in: {
                  $mergeObjects: [
                    '$$subDocument',
                    {
                      [nestedSubDocumentField]: {
                        $filter: {
                          input: `$$subDocument.${nestedSubDocumentField}`,
                          as: 'nestedSubDocument',
                          cond: {
                            $eq: ['$$nestedSubDocument.deleted', deleted],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ])
      .exec()
      .then((results) => results[0]); // Obtener el primer resultado

    // Si no se encuentra el documento, lanzar una excepción
    if (!result) {
      throw new NotFoundException(
        `Documento ${this.modelo.collection.name} con ID "${id}" no encontrado`,
      );
    }

    // Retornar el documento con subdocumentos filtrados
    return result as ModeloGeneral;
  }

  /**
   * Recupera un subdocumento específico por su ID dentro de un documento principal.
   * @param idModelo - ID del documento principal.
   * @param idSubModelo - ID del subdocumento a buscar.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreSubCampoNestedArreglo - Nombre del campo arreglo dentro del subdocumento.
   * @returns El subdocumento encontrado.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento.
   */
  async findById(
    idModelo: Types.ObjectId,
    idSubModelo: Types.ObjectId,
    nombreCampoArreglo: keyof ModeloGeneral,
    nombreSubCampoNestedArreglo: keyof SubModelo,
  ): Promise<SubModelo> {
    // Obtener el documento con subdocumentos filtrados
    const documento =
      await this.findById_WithNestedSubDocuments_ActiveOrInactive(
        idModelo,
        String(nombreCampoArreglo),
        String(nombreSubCampoNestedArreglo),
      );

    const arregloSubDocumentos = documento[
      nombreCampoArreglo
    ] as unknown as SubModelo[];

    // Buscar el subdocumento por ID
    const subdocumento = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubModelo),
    );

    if (!subdocumento) {
      throw new NotFoundException(
        `Subdocumento ${this.subModelo.collection.name} con ID "${idSubModelo}" no encontrado en el documento ${this.modelo.collection.name} con ID "${idModelo}"`,
      );
    }

    return subdocumento;
  }

  //#endregion

  //#region actualizar

  /**
   * Actualiza un subdocumento dentro de un arreglo en el documento principal.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumento - ID del subdocumento a actualizar.
   * @param idActualizadoPor - ID del usuario que realiza la actualización.
   * @param datosActualizacion - Datos para actualizar el subdocumento.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreSubCampoNestedArreglo - Nombre del campo arreglo dentro del subdocumento.
   * @returns El subdocumento actualizado.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento, o si el subdocumento está eliminado.
   */
  async updateInArray<K extends keyof ModeloGeneral>(
    idDocumento: Types.ObjectId,
    idSubDocumento: Types.ObjectId,
    idActualizadoPor: Types.ObjectId,
    datosActualizacion: Dto_Actualizar_SubmodeloInput,
    nombreCampoArreglo: K,
    nombreSubCampoNestedArreglo: keyof SubModelo,
  ): Promise<SubModelo> {
    // Verificar que el subdocumento no esté eliminado
    const subDocumentoAntes = await this.findById(
      idDocumento,
      idSubDocumento,
      nombreCampoArreglo,
      nombreSubCampoNestedArreglo,
    );
    if (subDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subdocumento ha sido eliminado "${idSubDocumento}"`,
      );
    }

    // Validar que el campo sea un arreglo
    this.validarCampoArreglo(nombreCampoArreglo);

    const nombreCampo = String(nombreCampoArreglo);

    // Construir el objeto `$set` para la actualización
    const camposActualizacion: Record<
      string,
      string | number | Types.ObjectId | boolean
    > = {};

    for (const [clave, valor] of Object.entries(datosActualizacion)) {
      camposActualizacion[`${nombreCampo}.$[elem].${clave}`] = valor;
    }

    camposActualizacion[`${nombreCampo}.$[elem].updatedBy`] = idActualizadoPor;

    const consultaActualizacion: UpdateQuery<ModeloGeneral> = {
      $set: camposActualizacion,
    };

    // Actualizar el subdocumento utilizando filtros de arreglo
    const documento = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, consultaActualizacion, {
        new: true,
        arrayFilters: [{ 'elem._id': idSubDocumento }],
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento ${this.modelo.modelName} con ID ${idDocumento} no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];

    // Obtener el subdocumento actualizado
    const subDocumentoActualizado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumento),
    );
    return subDocumentoActualizado;
  }

  //#endregion

  //#region eliminar

  /**
   * Realiza una eliminación lógica (soft delete) de un subdocumento dentro de un arreglo.
   * Cambia la propiedad `deleted` a `true` y asigna el usuario que realizó la eliminación.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumentoEliminar - ID del subdocumento a eliminar.
   * @param idEliminadoPor - ID del usuario que realiza la eliminación.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreSubCampoNestedArreglo - Nombre del campo arreglo dentro del subdocumento.
   * @returns El subdocumento eliminado lógicamente.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento, o si ya está eliminado.
   */
  async softDelete<K extends keyof ModeloGeneral>(
    idDocumento: Types.ObjectId,
    idSubDocumentoEliminar: Types.ObjectId,
    idEliminadoPor: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreSubCampoNestedArreglo: keyof SubModelo,
  ): Promise<SubModelo> {
    // Verificar que el subdocumento no esté ya eliminado
    const subDocumentoAntes = await this.findById(
      idDocumento,
      idSubDocumentoEliminar,
      nombreCampoArreglo,
      nombreSubCampoNestedArreglo,
    );

    if (subDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subdocumento ya fue eliminado "${idSubDocumentoEliminar}"`,
      );
    }

    this.validarCampoArreglo(nombreCampoArreglo);

    const nombreCampo = String(nombreCampoArreglo);

    // Construir el objeto `$set` para marcar como eliminado
    const camposActualizacion: Record<
      string,
      string | Types.ObjectId | boolean
    > = {};

    camposActualizacion[`${nombreCampo}.$[elem].deleted`] = true;
    camposActualizacion[`${nombreCampo}.$[elem].deletedBy`] = idEliminadoPor;

    const consultaActualizacion: UpdateQuery<ModeloGeneral> = {
      $set: camposActualizacion,
    };

    // Actualizar el subdocumento utilizando filtros de arreglo
    const documento = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, consultaActualizacion, {
        new: true,
        arrayFilters: [{ 'elem._id': idSubDocumentoEliminar }],
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento ${this.subModelo.modelName} con ID ${idDocumento} no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];

    // Obtener el subdocumento eliminado
    const subDocumentoEliminado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumentoEliminar),
    );

    return subDocumentoEliminado;
  }

  /**
   * Restaura un subdocumento previamente eliminado lógicamente.
   * @param idDocumento - ID del documento principal.
   * @param idSubDocumentoRestaurar - ID del subdocumento a restaurar.
   * @param idRestauradoPor - ID del usuario que realiza la restauración.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreSubCampoNestedArreglo - Nombre del campo arreglo dentro del subdocumento.
   * @returns El subdocumento restaurado.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento, o si no está eliminado.
   */
  async restore<K extends keyof ModeloGeneral>(
    idDocumento: Types.ObjectId,
    idSubDocumentoRestaurar: Types.ObjectId,
    idRestauradoPor: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreSubCampoNestedArreglo: keyof SubModelo,
  ): Promise<SubModelo> {
    const dtoActualizacion = {
      deleted: false,
    } as Dto_Actualizar_SubmodeloInput;

    // Verificar que el subdocumento esté eliminado
    const subDocumentoAntes = await this.findById(
      idDocumento,
      idSubDocumentoRestaurar,
      nombreCampoArreglo,
      nombreSubCampoNestedArreglo,
    );
    if (!subDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subdocumento ya fue restaurado "${idSubDocumentoRestaurar}"`,
      );
    }

    const nombreCampo = String(nombreCampoArreglo);

    // Construir el objeto `$set` para restaurar el subdocumento
    const camposActualizacion: Record<
      string,
      string | number | Types.ObjectId | boolean
    > = {};

    for (const [clave, valor] of Object.entries(dtoActualizacion)) {
      camposActualizacion[`${nombreCampo}.$[elem].${clave}`] = valor;
    }

    camposActualizacion[`${nombreCampo}.$[elem].updatedBy`] = idRestauradoPor;

    const consultaActualizacion: UpdateQuery<ModeloGeneral> = {
      $set: camposActualizacion,
    };

    // Actualizar el subdocumento utilizando filtros de arreglo
    const documento = await this.modelo
      .findOneAndUpdate({ _id: idDocumento }, consultaActualizacion, {
        new: true,
        arrayFilters: [{ 'elem._id': idSubDocumentoRestaurar }],
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento ${this.modelo.modelName} con ID ${idDocumento} no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];

    // Obtener el subdocumento restaurado
    const subDocumentoRestaurado = arregloSubDocumentos.find(
      (subDoc) => String(subDoc._id) === String(idSubDocumentoRestaurar),
    );
    return subDocumentoRestaurado;
  }

  //#endregion

  /**
   * Elimina definitivamente un subdocumento que ha sido previamente marcado como eliminado.
   * @param idDocumento - ID del documento principal.
   * @param idElemento - ID del subdocumento a eliminar definitivamente.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @param nombreSubCampoNestedArreglo - Nombre del campo arreglo dentro del subdocumento.
   * @returns El subdocumento eliminado definitivamente.
   * @throws NotFoundException si no se encuentra el documento o el subdocumento, o si no está marcado como eliminado.
   */
  async pullIfDeleted<K extends keyof ModeloGeneral>(
    idDocumento: Types.ObjectId,
    idElemento: Types.ObjectId,
    nombreCampoArreglo: K,
    nombreSubCampoNestedArreglo: keyof SubModelo,
  ): Promise<SubModelo> {
    // Verificar que el subdocumento esté marcado como eliminado
    const subDocumentoAntes = await this.findById(
      idDocumento,
      idElemento,
      nombreCampoArreglo,
      nombreSubCampoNestedArreglo,
    );

    if (!subDocumentoAntes.deleted) {
      throw new NotFoundException(
        `El subdocumento "${idElemento}" debe estar marcado como eliminado (deleted: true) para eliminarse`,
      );
    }

    const nombreCampo = String(nombreCampoArreglo);

    // Verificar que el documento y el subdocumento existen y están eliminados
    const documento = await this.modelo
      .findOne({
        _id: idDocumento,
        [`${nombreCampo}._id`]: idElemento,
        [`${nombreCampo}.deleted`]: true,
      })
      .exec();

    if (!documento) {
      throw new NotFoundException(
        `El elemento con ID "${idElemento}" no se encuentra o no está marcado como eliminado en el documento con ID "${idDocumento}"`,
      );
    }

    // Realizar el `pull` para eliminar definitivamente el subdocumento
    const actualizacion = {
      $pull: {
        [nombreCampo]: { _id: idElemento },
      },
    };

    // Actualizar el documento en la base de datos
    const documentoActualizado = await this.modelo
      .findByIdAndUpdate(
        idDocumento,
        actualizacion as UpdateQuery<ModeloGeneral>, // No cambiar el tipado con "as"
        {
          new: true,
        },
      )
      .exec();

    if (!documentoActualizado) {
      throw new NotFoundException(
        `No se pudo actualizar el documento con ID "${idDocumento}"`,
      );
    }

    // Retornar el subdocumento eliminado (antes de ser eliminado)
    return subDocumentoAntes;
  }

  /**
   * Elimina definitivamente todos los subdocumentos marcados como eliminados en un arreglo.
   * @param idDocumento - ID del documento principal.
   * @param nombreCampoArreglo - Nombre del campo arreglo en el documento principal.
   * @returns Un arreglo de subdocumentos que fueron eliminados.
   * @throws NotFoundException si no se encuentran subdocumentos marcados como eliminados.
   */
  async pullAllDeleted<K extends keyof ModeloGeneral>(
    idDocumento: Types.ObjectId,
    nombreCampoArreglo: K,
  ): Promise<SubModelo[]> {
    // Validar que el campo sea un arreglo
    this.validarCampoArreglo(nombreCampoArreglo);

    const nombreCampo = String(nombreCampoArreglo);

    // Buscar el documento para obtener los subdocumentos eliminados
    const documento = await this.modelo.findOne({ _id: idDocumento }).exec();

    if (!documento) {
      throw new NotFoundException(
        `Documento ${this.modelo.collection.name} con ID "${idDocumento}" no encontrado`,
      );
    }

    const arregloSubDocumentos = documento[nombreCampo] as SubModelo[];

    // Filtrar los subdocumentos que están marcados como `deleted: true`
    const elementosEliminados = arregloSubDocumentos.filter(
      (subDoc) => subDoc.deleted === true,
    );

    if (elementosEliminados.length === 0) {
      throw new NotFoundException(
        `No hay subdocumentos ${this.subModelo.collection.name} marcados como eliminados`,
      );
    }

    // Realizar el `pull` para eliminar todos los subdocumentos marcados como eliminados
    const actualizacion = {
      $pull: {
        [nombreCampo]: { deleted: true },
      },
    };

    // Actualizar el documento en la base de datos
    const documentoActualizado = await this.modelo
      .findByIdAndUpdate(
        idDocumento,
        actualizacion as UpdateQuery<ModeloGeneral>, // No cambiar el tipado con "as"
        {
          new: true,
        },
      )
      .exec();

    if (!documentoActualizado) {
      throw new NotFoundException(
        `No se pudo actualizar el documento con ID "${idDocumento}"`,
      );
    }

    // Retornar los subdocumentos que fueron eliminados
    return elementosEliminados;
  }
}
