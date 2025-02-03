import { FilterQuery, Model, Types } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatedUpdatedDeletedBy } from '../interfaces/created-updated-deleted-by.interface';
import { PaginationArgs, SearchTextArgs } from '../dtos';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import SearchField from '../clases/search-field.class';
import { ReturnDocument } from 'mongodb';

/**
 * Clase base para los servicios de los módulos.
 * @typeParam T - Tipo de la entidad que maneja el servicio.
 * @typeParam W - Tipo del DTO de actualización.
 * @typeParam U - Tipo del DTO de creación (por defecto es T).
 */
export abstract class BaseService<T extends CreatedUpdatedDeletedBy, W, U = T> {
  constructor(protected readonly model: Model<T>) {}

  //#region create

  /**
   * Crea un nuevo documento en la base de datos.
   * @param createDto - Datos del documento que se desea crear. Puede ser un DTO parcial.
   * @param userId - ID del usuario que realiza la creación.
   * @returns El documento creado como una instancia del modelo.
   */
  async create(
    createDto: Partial<U> | Partial<T>,
    userId: Types.ObjectId,
  ): Promise<T> {
    const created = await this.model.create({
      ...createDto,
      createdBy: userId,
    });
    return created;
  }

  //#endregion

  //#region find

  /**
   * Recupera todos los documentos activos con opciones de paginación.
   * @param pagination - Opciones de paginación, incluyendo el límite de documentos y el desplazamiento.
   * @returns Una lista de documentos activos paginados.
   */
  async findAll(pagination?: PaginationArgs): Promise<T[]> {
    const { limit, offset } = pagination;

    const query = { deleted: false };

    const data = await this.model
      .find(query)
      .skip(offset)
      .limit(limit)
      //.lean()
      .exec();

    return data;
  }

  /**
   * Recupera todos los documentos activos que coincidan con un texto de búsqueda en un campo específico, con opciones de paginación.
   * @param searchInput - Texto de búsqueda.
   * @param searchField - Campo de búsqueda.
   * @param pagination - Opciones de paginación, incluyendo el límite de documentos y el desplazamiento.
   * @returns Una lista de documentos activos paginados que coinciden con la búsqueda.
   * @throws InternalServerErrorException si el campo de búsqueda no existe en el esquema.
   */
  async findAllBy(
    searchInput: SearchTextArgs,
    searchField: SearchField<T>,
    pagination?: PaginationArgs,
  ): Promise<T[]> {
    const { limit = 10, offset = 0 } = pagination || {};
    const { search } = searchInput;
    const { field } = searchField;

    const schemaKeys = Object.keys(this.model.schema.paths) as Array<keyof T>;
    const key = schemaKeys.find((key) => key === field);

    if (!key) {
      throw new InternalServerErrorException(
        `El campo de búsqueda "${String(field)}" no existe en el esquema de ${this.model.collection.name}`,
      );
    }

    const query = search
      ? { [key]: { $regex: search, $options: 'i' }, deleted: false }
      : { deleted: false };

    const documents = await this.model
      .find(query as FilterQuery<T>)
      .skip(offset)
      .limit(limit)
      .exec();

    return documents as unknown as T[];
  }

  /**
   * Recupera un documento activo específico por su ID.
   * @param id - El ID del documento a buscar.
   * @returns El documento encontrado.
   * @throws NotFoundException si no se encuentra el documento.
   */
  async findById(id: Types.ObjectId): Promise<T> {
    const document = await this.model.findOne({ _id: id, deleted: false });

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${id}" no encontrado`,
      );
    }

    return document;
  }

  /**
   * Recupera un documento activo específico basado en un campo especificado
   * @param value - El valor del campo de búsqueda.
   * @param searchField - Campo de búsqueda.
   * @returns El documento encontrado.
   * @throws NotFoundException si no se encuentra el documento.
   * @throws InternalServerErrorException si el campo de búsqueda no existe en el esquema.
   */
  async findOne(
    value: Types.ObjectId,
    searchField: SearchField<T>,
  ): Promise<T> {
    const { field } = searchField;

    // Verificar que el campo de búsqueda existe en el esquema
    if (!this.model.schema.paths[field as string]) {
      throw new InternalServerErrorException(
        `El campo de búsqueda "${field}" no existe en el esquema de ${this.model.collection.name}`,
      );
    }

    // Construir la consulta dinámicamente usando el campo de búsqueda
    const query = { [field]: value, deleted: false };

    const document = await this.model.findOne(query);

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ${field} "${value}" no encontrado`,
      );
    }

    return document;
  }

  /**
   * Recupera un documento por su ID y filtra su campo de subdocumentos basado en el estado 'deleted'.
   * @param id - El ID del documento principal.
   * @param subDocumentField - El nombre del campo de subdocumentos (arreglo) a filtrar.
   * @param deleted - El estado 'deleted' por el cual filtrar los subdocumentos (por defecto es false).
   * @returns El documento con el campo de subdocumentos filtrado.
   * @throws NotFoundException si el documento no existe.
   * @throws InternalServerErrorException si el subDocumentField no existe en el esquema del modelo.
   */
  async findById_WithSubDocuments_ActiveOrInactive<K extends keyof T>(
    id: Types.ObjectId,
    subDocumentField: K,
    deleted: boolean = false,
  ): Promise<T> {
    // Verificar que subDocumentField es un campo válido en el esquema
    if (!this.model.schema.paths[subDocumentField as string]) {
      throw new InternalServerErrorException(
        `El campo "${String(subDocumentField)}" no existe en el esquema del modelo   ${this.model.collection.name}`,
      );
    }

    const result = await this.model
      .aggregate([
        { $match: { _id: id, deleted: false } }, // Filtrar el documento principal
        {
          // Añadir un campo con los subdocumentos filtrados
          $addFields: {
            [subDocumentField]: {
              $filter: {
                input: `$${String(subDocumentField)}`,
                as: 'subDocument',
                cond: { $eq: ['$$subDocument.deleted', deleted] },
              },
            },
          },
        },
      ])
      .exec()
      .then((results) => results[0]);

    if (!result) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${id}" no encontrado`,
      );
    }

    return result as T;
  }

  /**
   * Recupera un documento por su ID y filtra un subdocumento y sus subsubdocumentos basado en el estado 'deleted'.
   * @param id - El ID del documento principal.
   * @param subDocumentField - El nombre del campo de subdocumentos (arreglo) a filtrar. Ejemplo: 'preguntas'.
   * @param nestedSubDocumentField - El nombre del campo de subsubdocumentos dentro del subdocumento. Ejemplo: 'opciones'.
   * @param deleted - El estado 'deleted' por el cual filtrar los subdocumentos y subsubdocumentos (por defecto es false).
   * @returns El documento principal con los subdocumentos y subsubdocumentos filtrados según el estado 'deleted'.
   * @throws NotFoundException si el documento no existe.
   * @throws InternalServerErrorException si el subDocumentField o nestedSubDocumentField no existe en el esquema del modelo.
   */
  async findById_WithNestedSubDocuments_ActiveOrInactive(
    id: Types.ObjectId,
    subDocumentField: string,
    nestedSubDocumentField: string,
    deleted_mainDocument: boolean,
    deleted_subDocument: boolean,
    deleted_nestedDocument: boolean,
  ): Promise<T> {
    // Validar que el subDocumentField existe en el esquema del modelo
    // if (!this.model.schema.paths[subDocumentField]) {
    //   throw new InternalServerErrorException(
    //     `El campo "${subDocumentField}" no existe en el esquema del modelo  cccc ${this.model.collection.name}`,
    //   );
    // }

    const result = await this.model
      .aggregate([
        { $match: { _id: id, deleted: deleted_mainDocument } },
        {
          $addFields: {
            [subDocumentField]: {
              $filter: {
                input: `$${subDocumentField}`,
                as: 'subDocument',
                cond: { $eq: ['$$subDocument.deleted', deleted_subDocument] },
              },
            },
          },
        },
        {
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
                            $eq: [
                              '$$nestedSubDocument.deleted',
                              deleted_nestedDocument,
                            ],
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
      .then((results) => results[0]);

    if (!result) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${id}" no encontrado`,
      );
    }

    return result as T;
  }

  //#endregion

  //#region update

  /**
   * Actualiza un documento existente por su ID.
   * @param id - El ID del documento que se desea actualizar.
   * @param updateDto - Datos a actualizar en el documento. Puede ser un DTO parcial.
   * @param idUpdatedBy - ID del usuario que realiza la actualización.
   * @returns El documento actualizado.
   * @throws NotFoundException si no se encuentra el documento.
   */
  async update(
    id: Types.ObjectId,
    updateDto: Partial<W>,
    idUpdatedBy: Types.ObjectId,
  ): Promise<T> {
    const document = await this.model.findOneAndUpdate(
      { _id: id, deleted: false },
      {
        ...updateDto,
        updatedBy: idUpdatedBy,
      },
      { new: true, runValidators: true },
    );

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${id}" no encontrado`,
      );
    }

    return document;
  }

  //#endregion

  //#region delete

  /**
   * Realiza una eliminación lógica (soft delete) de un documento por su ID.
   * @param idDelete - ID del documento a eliminar.
   * @param idThanos - ID del usuario que realiza la eliminación.
   * @returns El documento eliminado lógicamente.
   * @throws NotFoundException si el documento no existe o ya está eliminado.
   */
  async softDelete(
    idDelete: Types.ObjectId,
    idThanos: Types.ObjectId,
  ): Promise<T> {
    const documentSoftDeleted = await this.model.findOneAndUpdate(
      { _id: idDelete, deleted: false },
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: idThanos,
      },
      { new: true },
    );

    if (!documentSoftDeleted) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${idDelete}" no encontrado o ya está eliminado`,
      );
    }

    return documentSoftDeleted;
  }

  /**
   * Elimina un documento de forma permanente por su ID (hard delete).
   * @param idHardDelete - ID del documento a eliminar.
   * @returns El documento eliminado permanentemente.
   * @throws NotFoundException si el documento no existe.
   * @throws ConflictException si el documento no está marcado como eliminado.
   */
  async hardDelete(idHardDelete: Types.ObjectId): Promise<T> {
    const document = await this.model.collection.findOne({
      _id: idHardDelete,
    });

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${idHardDelete}" no encontrado`,
      );
    }

    if (document.deleted !== true) {
      throw new ConflictException(
        `El documento ${this.model.collection.name} debe estar marcado como "deleted: true" para eliminarlo permanentemente`,
      );
    }

    const deletedDocument = await this.model.collection.findOneAndDelete({
      _id: idHardDelete,
    });

    return deletedDocument as unknown as T;
  }

  /**
   * Elimina todos los documentos marcados como "deleted: true" de forma permanente.
   * @returns Un objeto con el número de documentos eliminados.
   * @throws InternalServerErrorException en caso de error durante la eliminación.
   */
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    try {
      const result = await this.model.deleteMany({ deleted: true });
      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar los documentos ${this.model.collection.name} permanentemente`,
        error.message,
      );
    }
  }

  /**
   * Obtiene todos los documentos marcados como "deleted: true".
   * @param pagination - Opciones de paginación, incluyendo el límite de documentos y el desplazamiento.
   * @returns Un array de documentos eliminados.
   * @throws InternalServerErrorException en caso de error durante la búsqueda.
   */
  async findSoftDeleted(pagination?: PaginationArgs): Promise<T[]> {
    const { limit, offset } = pagination || {};
    try {
      return this.model
        .aggregate([{ $match: { deleted: true } }])
        .skip(offset)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar documentos ${this.model.collection.name} eliminados`,
        error.message,
      );
    }
  }

  /**
   * Restaura un documento previamente eliminado lógicamente.
   * @param idRestore - ID del documento a restaurar.
   * @param updatedBy - ID del usuario que realiza la restauración.
   * @returns El documento restaurado.
   * @throws NotFoundException si el documento no existe.
   * @throws ConflictException si el documento no está marcado como eliminado.
   * @throws InternalServerErrorException en caso de error durante la restauración.
   */
  async restore(
    idRestore: Types.ObjectId,
    updatedBy: Types.ObjectId,
  ): Promise<T> {
    try {
      const document = await this.model.collection.findOne({ _id: idRestore });

      if (!document) {
        throw new NotFoundException(
          `Documento ${this.model.collection.name} ID "${idRestore}" no encontrado, tal vez ya esta eliminado`,
        );
      }

      if (!document.deleted) {
        throw new ConflictException(
          `El documento ${this.model.collection.name} con ID "${idRestore}" no está marcado como eliminado, no es necesario restaurarlo`,
        );
      }

      const updatedDocument = await this.model.collection.findOneAndUpdate(
        { _id: idRestore, deleted: true }, // Incluye `deleted: true` en la condición
        {
          $set: {
            deleted: false,
            updatedBy: updatedBy,
          },
        },
        { returnDocument: ReturnDocument.AFTER }, // Para versiones antiguas de Mongoose, usa `{ returnOriginal: false }`
      );

      const restoredDocument = updatedDocument as unknown as T;

      return restoredDocument;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al restaurar el documento ${this.model.collection.name}, tal vez ya se tenga un documento activo, no se puede tener dos cuestionarios de un mismo curso activos `,
        error.message,
      );
    }
  }
}

//#endregion
