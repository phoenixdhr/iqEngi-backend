// src/common/middlewares/soft-delete.middleware.ts
import { Schema, Query, CallbackError } from 'mongoose';
import { CreatedUpdatedDeletedBy } from '../interfaces/created-updated-deleted-by.interface';

/**
 * Añade un middleware de eliminación suave (soft delete) a un esquema de Mongoose.
 * Este middleware se ejecuta antes de cualquier operación de búsqueda (find) y
 * excluye los documentos que tienen el campo `deleted` establecido en `true`.
 *
 * @template T - El tipo de documento que va devolver la consulta.
 * @template U - El tipo de documento que se está consultando y que extiende de CreatedUpdatedDeletedBy.
 * @Typos T y U pueden ser el mismo documento
 * @param {Schema} schema - El esquema de Mongoose al que se le añadirá el middleware.
 * @this representa una consultsa, es una instancia de @Query , el contexto de la consulta que se está realizando.
 *
 * El middleware que defines en el esquema de Mongoose afecta exclusivamente a
 * las funciones de Mongoose (como find, findOne, etc.) y no afecta directamente a las funciones que tú creas en tus servicios.

 */
export function addSoftDeleteMiddleware<T, U extends CreatedUpdatedDeletedBy>(
  schema: Schema,
): void {
  schema.pre(
    /^find/,
    function (this: Query<T | T[], U>, next: (err?: CallbackError) => void) {
      this.where({ deleted: { $ne: true } });
      next();
    },
  );
}
