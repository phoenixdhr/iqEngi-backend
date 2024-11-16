// src/common/services/base.service.ts

import { FilterQuery, Model, Types } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatedUpdatedDeletedBy } from '../interfaces/created-updated-deleted-by.interface';
import { PaginationArgs, SearchTextArgs } from '../dtos';
import { deletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { ReturnDocument } from 'mongodb';
import SearchField from '../clases/search-field.class';

/**
 * Clase base para los servicios de los módulos.
 * @param T - Tipo de la entidad - entidad que va  devolver la funcion.
 * @param W - Tipo del DTO de actualización.
 * @param U - Tipo del DTO de creación.
 */
export abstract class BaseService<T extends CreatedUpdatedDeletedBy, W, U = T> {
  constructor(protected readonly model: Model<T>) {}

  //#region create
  /**
   * Crea un nuevo documento en la base de datos.
   * @param createDto - Datos del documento que se desea crear. Puede ser un DTO parcial.
   * @param userId - (Opcional) ID del usuario que realiza la creación.
   * @returns El documento creado como una instancia del modelo.
   */
  async create(createDto: Partial<U> | Partial<T>, userId: string): Promise<T> {
    const created = await this.model.create({
      ...createDto,
      createdBy: new Types.ObjectId(userId),
    });
    return created;
  }

  // #region find
  /**
   * Recupera todos los documentos con opciones de paginación.
   * @param pagination - Opciones de paginación, incluyendo el límite de documentos y el desplazamiento.
   * @returns Una lista de documentos paginados.
   */
  async findAll(pagination?: PaginationArgs): Promise<T[]> {
    const { limit, offset } = pagination;
    return this.model.find().skip(offset).limit(limit).exec();
  }

  /**
   * Recupera todos los documentos con un texto de busqueda y con un campo especifico (Field) con opciones de paginación.
   * @param searchInput - Texto de búsqueda.
   * @param searchField - Campo de búsqueda.
   * @param pagination - Opciones de paginación, incluyendo el límite de documentos y el desplazamiento.
   * @returns Una lista de documentos paginados.
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
        `El campo de búsqueda "${String(key)}" no existe en el esquema de ${this.model.collection.name}`,
      );
    }
    const query = search ? { [key]: { $regex: search, $options: 'i' } } : {};

    const documents = await this.model
      .find(query as FilterQuery<T>)
      .skip(offset)
      .limit(limit)
      .exec();

    return documents as unknown as T[];
  }

  /**
   * Recupera un documento específico por su ID.
   * @param id - El ID del documento a buscar.
   * @returns El documento encontrado.
   * @throws NotFoundException si no se encuentra el documento.
   */
  async findById(id: string): Promise<T> {
    const document = await this.model.findById(id);

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${id}" no encontrado`,
      );
    }

    return document;
  }

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
    id: string,
    updateDto: Partial<W>,
    idUpdatedBy: string,
  ): Promise<T> {
    const document = await this.model.findByIdAndUpdate(
      id,
      {
        ...updateDto,
        updatedBy: idUpdatedBy,
      },
      { new: true, runValidators: true },
    );

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name}con ID "${id}" no encontrado`,
      );
    }

    return document;
  }

  //#region delete
  /**
   * Elimina (desactiva) un documento por su ID (soft delete).
   * @param idDelete ID del documento a eliminar.
   * @param idThanos ID del documento que realiza la eliminación.
   * @returns El documento eliminado.
   * @throws NotFoundException si el documento no existe.
   */
  async softDelete(idDelete: string, idThanos: string): Promise<T> {
    const documentSoftDeleted = await this.model.findByIdAndUpdate(
      idDelete,
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: new Types.ObjectId(idThanos),
      },
      { new: true },
    );

    if (!documentSoftDeleted) {
      throw new NotFoundException(
        `Documento ${documentSoftDeleted.baseModelName} con ID "${idDelete}" no encontrado, o tal vez haya sido eliminado`,
      );
    }

    return documentSoftDeleted;
  }

  /**
   * Elimina un documento de forma permanente por su ID (hard delete).
   * @param id ID del documento a eliminar.
   * @returns El documento eliminado.
   * @throws NotFoundException si el documento no existe.
   */
  async hardDelete(idHardDelete: string): Promise<T> {
    const id = new Types.ObjectId(idHardDelete);

    const document = await this.model.collection.findOne({
      _id: id,
    });

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${id}" no encontrado`,
      );
    }

    if (document.deleted !== true) {
      throw new ConflictException(
        `El Documento ${this.model.collection.name} debe estar marcado como "deleted:true" para eliminarlo permanentemente`,
      );
    }

    const deletedDocument = await this.model.collection.findOneAndDelete({
      _id: id,
    });

    return deletedDocument as unknown as T;
  }

  /**
   * Elimina todos los documentos marcados como "deleted: true".
   * @returns un objeto con el numero de documentos eliminados.
   */
  async hardDeleteAllSoftDeleted(): Promise<deletedCountOutput> {
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
   * @returns Un array de documentos eliminados.
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
   * Restaura un documento eliminado.
   * @param id ID del documento a restaurar.
   * @param userUpdatedId ID del documento que realiza la restauración.
   * @returns El documento restaurado.
   * @throws NotFoundException si el documento no existe.
   */
  async restore(id: string, userUpdatedId: string): Promise<T> {
    // Convertir el id a ObjectId si es necesario
    const idRestore = new Types.ObjectId(id);
    const updatedBy = new Types.ObjectId(userUpdatedId);

    try {
      const document = await this.model.collection.findOne({ _id: idRestore });

      if (!document) {
        throw new NotFoundException(
          `Documento ${this.model.baseModelName} ID "${id}" no encontrado, tal vez ya esta eliminado`,
        );
      }

      if (!document.deleted) {
        throw new ConflictException(
          `El documento ${this.model.baseModelName} con ID "${id}" no está marcado como eliminado, no es necesario restaurarlo`,
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
        `Error al restaurar el documento ${this.model.collection.name}`,
        error.message,
      );
    }
  }
}
