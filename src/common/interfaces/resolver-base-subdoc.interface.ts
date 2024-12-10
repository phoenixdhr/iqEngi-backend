import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';

/**
 * Interfaz genérica que define los métodos básicos que deben implementar los resolvers.
 * @template Entity - Tipo de la entidad principal.
 * @template CreateInput - Tipo del DTO para crear una entidad.
 * @template UpdateInput - Tipo del DTO para actualizar una entidad.
 */
export interface IResolver_SubDocument<Entity, CreateInput, UpdateInput> {
  /**
   * Crea una nueva entidad dentro de un documento principal.
   * @param parentId ID del documento principal.
   * @param createInput Datos para crear la entidad.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La entidad creada.
   */
  create(
    parentId: Types.ObjectId,
    createInput: CreateInput,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Obtiene una entidad específica dentro de un documento principal.
   * @param parentId ID del documento principal.
   * @param entityId ID de la entidad a buscar.
   * @returns La entidad encontrada.
   */
  findById(parentId: Types.ObjectId, entityId: Types.ObjectId): Promise<Entity>;

  /**
   * Obtiene todas las entidades dentro de un documento principal.
   * @param parentId ID del documento principal.
   * @returns Una lista de entidades.
   */
  findAll(parentId: Types.ObjectId): Promise<Entity[]>;

  /**
   * Actualiza una entidad específica dentro de un documento principal.
   * @param parentId ID del documento principal.
   * @param entityId ID de la entidad a actualizar.
   * @param updateInput Datos para actualizar la entidad.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La entidad actualizada.
   */
  update(
    parentId: Types.ObjectId,
    entityId: Types.ObjectId,
    updateInput: UpdateInput,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Realiza una eliminación lógica de una entidad dentro de un documento principal.
   * @param parentId ID del documento principal.
   * @param entityId ID de la entidad a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La entidad eliminada lógicamente.
   */
  softDelete(
    parentId: Types.ObjectId,
    entityId: Types.ObjectId,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Restaura una entidad que ha sido eliminada lógicamente.
   * @param parentId ID del documento principal.
   * @param entityId ID de la entidad a restaurar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La entidad restaurada.
   */
  restore(
    parentId: Types.ObjectId,
    entityId: Types.ObjectId,
    user: UserRequest,
  ): Promise<Entity>;

  /**
   * Obtiene todas las entidades eliminadas lógicamente dentro de un documento principal.
   * @param parentId ID del documento principal.
   * @returns Una lista de entidades eliminadas lógicamente.
   */
  findSoftDeleted(parentId: Types.ObjectId): Promise<Entity[]>;

  /**
   * Elimina permanentemente una entidad marcada como eliminada lógicamente.
   * @param parentId ID del documento principal.
   * @param entityId ID de la entidad a eliminar permanentemente.
   * @returns La entidad eliminada permanentemente.
   */
  hardDelete(
    parentId: Types.ObjectId,
    entityId: Types.ObjectId,
  ): Promise<Entity>;

  /**
   * Elimina permanentemente todas las entidades marcadas como eliminadas lógicamente.
   * @param parentId ID del documento principal.
   * @returns Una lista de entidades eliminadas permanentemente.
   */
  hardDeleteAllSoftDeleted(parentId: Types.ObjectId): Promise<Entity[]>;
}
