// // src/common/middlewares/post-save-update-related.middleware.ts

// import { Schema, Model, Document, CallbackError } from 'mongoose';
// /**
//  * Añade un middleware post-save para actualizar documentos relacionados.
//  *
//  * @template T - Tipo del documento actual.
//  * @template U - Tipo del documento relacionado.
//  * @param {Schema<T>} schema - El esquema de Mongoose al que se añade el middleware.
//  * @param {string} relatedModelName - Nombre del modelo relacionado a actualizar.
//  * @param {string} field_idSchema_in_relatedModel - Campo en el modelo relacionado para hacer el match con el documento guardado.
//  * @param {(doc: T) => Record<string, any>} getUpdateFields - Función que toma el documento guardado y devuelve los campos a actualizar en el modelo relacionado.
//  */
// export function postSave_updateIn_relatedModel_Middleware<
//   T extends Document,
//   U extends Document,
// >(
//   schema: Schema<T>,
//   relatedModelName: string,
//   field_idSchema_in_relatedModel: string,
//   field_toChanche_in_relatedModel: string,
//   field_chanche_in_Schema: string,
// ): void {
//   schema.post<T>(
//     'save',
//     async function (doc: T, next: (err?: CallbackError) => void) {
//       try {
//         // Obtiene el modelo relacionado desde el contexto del documento actual
//         const relatedModel = this.model(relatedModelName) as Model<U>;

//         const query = { [field_idSchema_in_relatedModel]: doc['_id'] };

//         await relatedModel.collection.updateMany(query, {
//           $set: {
//             [field_toChanche_in_relatedModel]: doc[field_chanche_in_Schema],
//           },
//         });

//         next();
//       } catch (error) {
//         next(error);
//       }
//     },
//   );
// }

// src/common/middlewares/post-save-update-related.middleware.ts
import { Schema, Model, Document, CallbackError } from 'mongoose';

/**
 * Middleware de post-save para actualizar documentos relacionados en un modelo específico.
 *
 * Este middleware se ejecuta después de guardar un documento del esquema actual,
 * y actualiza documentos en un modelo relacionado basado en un campo común.
 *
 * @template T - Tipo del documento actual (el que dispara el evento de save).
 * @template U - Tipo del documento relacionado (el que se actualizará).
 * @param schema - El esquema de Mongoose al que se añade el middleware.
 * @param relatedModelName - Nombre del modelo relacionado que será actualizado.
 * @param field_idSchema_in_relatedModel - Nombre del campo en el modelo relacionado que coincide con el `_id` del documento guardado.
 * @param getUpdateFields - Función que toma el documento guardado y devuelve un objeto con los campos que deben actualizarse en el modelo relacionado.
 */
export function postSave_updateIn_relatedModel_Middleware<
  T extends Document,
  U extends Document,
>(
  schema: Schema<T>,
  relatedModelName: string,
  field_idSchema_in_relatedModel: string,
  getUpdateFields: (doc: T) => Record<string, string | number>,
): void {
  schema.post<T>(
    'save',
    async function (doc: T, next: (err?: CallbackError) => void) {
      try {
        // Obtiene el modelo relacionado utilizando el nombre del modelo relacionado
        const relatedModel = this.model(relatedModelName) as Model<U>;

        // Crea la consulta para encontrar documentos relacionados que coincidan
        const query = { [field_idSchema_in_relatedModel]: doc['_id'] };

        // Genera los campos de actualización usando la función proporcionada
        const update = getUpdateFields(doc);

        // Ejecuta la actualización en el modelo relacionado
        await relatedModel.collection.updateMany(query, {
          $set: update,
        });

        // Llama al siguiente middleware o finaliza el proceso
        next();
      } catch (error) {
        // Pasa cualquier error al siguiente middleware para manejo de errores
        next(error);
      }
    },
  );
}
