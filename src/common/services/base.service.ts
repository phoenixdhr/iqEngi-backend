// src/common/services/base.service.ts

import { Model, Types } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatedUpdatedDeletedBy } from '../interfaces/created-updated-deleted-by.interface';
import { PaginationArgs } from '../dtos';

export abstract class BaseService<T extends CreatedUpdatedDeletedBy, W, U = T> {
  constructor(protected readonly model: Model<T>) {}

  //#region create
  /**
   * Crea un nuevo documento en la base de datos.
   * @param createDto - Datos del documento que se desea crear. Puede ser un DTO parcial.
   * @param userId - (Opcional) ID del usuario que realiza la creación.
   * @returns El documento creado como una instancia del modelo.
   */
  async create(
    createDto: Partial<U> | Partial<T>,
    userId?: string,
  ): Promise<T> {
    const created = await this.model.create({
      ...createDto,
      createdBy: new Types.ObjectId(userId),
    });
    return created;
  }

  //#region find
  /**
   * Recupera todos los documentos con opciones de paginación.
   * @param pagination - Opciones de paginación, incluyendo el límite de documentos y el desplazamiento.
   * @returns Una lista de documentos paginados.
   */
  async findAll(pagination?: PaginationArgs): Promise<T[]> {
    const { limit = 10, offset = 0 } = pagination || {};
    return this.model.find().skip(offset).limit(limit).exec();
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
        `Documento ${document.baseModelName} con ID "${id}" no encontrado`,
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
        `Documento ${document.baseModelName} con ID "${id}" no encontrado`,
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
        `Documento ${documentSoftDeleted.baseModelName} con ID "${idDelete}" no encontrado`,
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
  async hardDelete(id: string): Promise<T> {
    const document = await this.model.findById(id).exec();

    if (!document) {
      throw new NotFoundException(
        `Documento ${document.baseModelName} con ID "${id}" no encontrado`,
      );
    }

    if (document.deleted !== true) {
      throw new ConflictException(
        `El Documento ${document.baseModelName} debe estar marcado como "deleted:true" para eliminarlo permanentemente`,
      );
    }

    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    return deletedDocument;
  }

  /**
   * Elimina todos los documentos marcados como "deleted: true".
   * @returns un objeto con el numero de documentos eliminados.
   */
  async hardDeleteAllSoftDeleted(): Promise<{ deletedCount: number }> {
    try {
      const result = await this.model.deleteMany({ deleted: true });
      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar los documentos permanentemente`,
        error.message,
      );
    }
  }

  /**
   * Obtiene todos los documentos marcados como "deleted: true".
   * @returns Un array de documentos eliminados.
   */
  async findSoftDeleted(pagination?: PaginationArgs): Promise<T[]> {
    const { limit = 10, offset = 0 } = pagination || {};
    try {
      return this.model
        .find({ deleted: true })
        .skip(offset)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar documentos eliminados',
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
  async restore(id: string, userId: string): Promise<T> {
    const document = await this.model.findByIdAndUpdate(
      id,
      {
        deleted: false,
        updatedBy: new Types.ObjectId(userId),
      },
      { new: true },
    );

    if (!document) {
      throw new NotFoundException(
        `Documento ${document.baseModelName} ID "${id}" no encontrado`,
      );
    }

    return document;
  }
}
