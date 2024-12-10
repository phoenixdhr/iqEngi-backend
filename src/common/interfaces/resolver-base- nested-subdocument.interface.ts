import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';

/**
 * Interfaz genérica para resolvers que gestionan subdocumentos anidados.
 * @template Entity - Tipo del subdocumento (e.g., Opción).
 * @template CreateInput - Tipo del DTO para crear un subdocumento.
 * @template UpdateInput - Tipo del DTO para actualizar un subdocumento.
 */
export interface IResolver_NestedSubDocument<Entity, CreateInput, UpdateInput> {
  /**
   * Crea un nuevo subdocumento dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @param createInput Datos para crear el subdocumento.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El subdocumento creado.
   */
  create(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
    createInput: CreateInput,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Obtiene un subdocumento específico dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @param entityId ID del subdocumento a buscar.
   * @returns El subdocumento encontrado.
   */
  findById(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
    entityId: Types.ObjectId,
  ): Promise<Entity>;

  /**
   * Obtiene todos los subdocumentos dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @returns Una lista de subdocumentos.
   */
  findAll(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
  ): Promise<Entity[]>;

  /**
   * Actualiza un subdocumento dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @param entityId ID del subdocumento a actualizar.
   * @param updateInput Datos para actualizar el subdocumento.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El subdocumento actualizado.
   */
  update(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
    entityId: Types.ObjectId,
    updateInput: UpdateInput,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Realiza una eliminación lógica de un subdocumento dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @param entityId ID del subdocumento a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El subdocumento eliminado lógicamente.
   */
  softDelete(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
    entityId: Types.ObjectId,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Restaura un subdocumento eliminado lógicamente dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @param entityId ID del subdocumento a restaurar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El subdocumento restaurado.
   */
  restore(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
    entityId: Types.ObjectId,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Obtiene todos los subdocumentos eliminados lógicamente dentro de una entidad secundaria.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @returns Una lista de subdocumentos eliminados lógicamente.
   */
  findSoftDeleted(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
  ): Promise<Entity[]>;

  /**
   * Elimina permanentemente un subdocumento marcado como eliminado lógicamente.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @param entityId ID del subdocumento a eliminar permanentemente.
   * @returns El subdocumento eliminado permanentemente.
   */
  hardDelete(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
    entityId: Types.ObjectId,
  ): Promise<Entity>;

  /**
   * Elimina permanentemente todos los subdocumentos marcados como eliminados lógicamente.
   * @param parentId ID del documento principal (e.g., Cuestionario).
   * @param subParentId ID del documento secundario (e.g., Pregunta).
   * @returns Una lista de subdocumentos eliminados permanentemente.
   */
  hardDeleteAllSoftDeleted(
    parentId: Types.ObjectId,
    subParentId: Types.ObjectId,
  ): Promise<Entity[]>;
}
