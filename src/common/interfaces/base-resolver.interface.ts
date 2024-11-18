// src/common/resolvers/base-resolver.interface.ts

import { deletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { PaginationArgs, SearchTextArgs } from '../dtos';
import SearchField from '../clases/search-field.class';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';

/**
 * Interfaz que define los métodos básicos que deben implementar todos los resolvers.
 * @template OutputDocument - Tipo de la entidad.
 * @template CreateInput - Tipo del DTO para crear una entidad.
 * @template UpdateInput - Tipo del DTO para actualizar una entidad.
 */
export interface IBaseResolver<OutputDocument, CreateInput, UpdateInput> {
  /**
   * Crea una nueva entidad.
   * @param createInput Datos para crear la entidad.
   * @param userId ID del usuario que realiza la creación.
   * @returns La entidad creada.
   */
  create(
    createInput: CreateInput,
    userId: UserRequest,
  ): Promise<OutputDocument>;

  /**
   * Obtiene todas las entidades con opciones de paginación.
   * @param pagination Opciones de paginación.
   * @returns Un array de entidades.
   */
  findAll(pagination?: PaginationArgs): Promise<OutputDocument[]>;

  /**
   * Obtiene todas las entidades filtradas por un texto de búsqueda y un campo específico, con opciones de paginación.
   * @param searchInput Texto de búsqueda.
   * @param searchField Campo específico para la búsqueda.
   * @param pagination Opciones de paginación.
   * @returns Un array de entidades filtradas.
   */
  findAllBy?(
    searchInput: SearchTextArgs,
    searchField: SearchField<OutputDocument>,
    pagination?: PaginationArgs,
  ): Promise<OutputDocument[]>;

  /**
   * Obtiene una entidad por su ID.
   * @param id ID de la entidad.
   * @returns La entidad encontrada.
   */
  findById(id: string): Promise<OutputDocument>;

  /**
   * Actualiza una entidad existente.
   * @param id del documento para actualizar.
   * @param updateInput Datos para actualizar la entidad.
   * @param user  usuario que realiza la actualización.
   * @returns La entidad actualizada.
   */
  update(
    id: string,
    updateInput: UpdateInput,
    user: UserRequest,
  ): Promise<OutputDocument>;

  /**
   * Elimina (desactiva) una entidad por su ID.
   * @param idRemove ID de la entidad a eliminar.
   * @param user ID del usuario que realiza la eliminación.
   * @returns La entidad eliminada.
   */
  softDelete(idRemove: string, user: UserRequest): Promise<OutputDocument>;

  /**
   * Elimina permanentemente una entidad por su ID.
   * @param idRemove ID de la entidad a eliminar.
   * @returns La entidad eliminada.
   */
  hardDelete(idRemove: string): Promise<OutputDocument>;

  /**
   * Elimina permanentemente todas las entidades que están marcadas como eliminadas.
   * @returns Un objeto con el número de entidades eliminadas.
   */
  hardDeleteAllSoftDeleted(): Promise<deletedCountOutput>;

  /**
   * Obtiene todas las entidades que están marcadas como eliminadas, con opciones de paginación.
   * @param pagination Opciones de paginación.
   * @returns Un array de entidades eliminadas.
   */
  findSoftDeleted(pagination?: PaginationArgs): Promise<OutputDocument[]>;

  /**
   * Restaura una entidad que ha sido eliminada.
   * @param idRestore ID de la entidad a restaurar.
   * @param user ID del usuario que realiza la restauración.
   * @returns La entidad restaurada.
   */
  restore(idRestore: string, user: UserRequest): Promise<OutputDocument>;
}
