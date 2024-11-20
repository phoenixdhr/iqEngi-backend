// // src/common/middlewares/post-findOneAndUpdate-update-related.middleware.ts

// import { Schema, Model, Document, CallbackError } from 'mongoose';

// /**
//  * Añade un middleware post-findOneAndUpdate para actualizar documentos relacionados.
//  *
//  * @template T - Tipo del documento actual.
//  * @template U - Tipo del documento relacionado.
//  * @param {Schema<T>} schema - El esquema de Mongoose al que se añade el middleware.
//  * @param {string} relatedModelName - Nombre del modelo relacionado a actualizar.
//  * @param {string} fieldId_in_relatedModel - Campo en el modelo relacionado para hacer el match con el documento actualizado.
//  * @param {(doc: T) => Record<string, any>} getUpdateFields - Función que toma el documento actualizado y devuelve los campos a actualizar en el modelo relacionado.
//  */
// export function postUpdate_updateIn_relatedModel_Middleware<
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
//     'findOneAndUpdate',
//     async function (doc: T | null, next: (err?: CallbackError) => void) {
//       try {
//         if (doc) {
//           // Obtiene el modelo relacionado desde el contexto de la consulta
//           const relatedModel = this.model(relatedModelName) as Model<U>;

//           const query = { [field_idSchema_in_relatedModel]: doc['_id'] };

//           await relatedModel.collection.updateMany(query, {
//             $set: {
//               [field_toChanche_in_relatedModel]: doc[field_chanche_in_Schema],
//             },
//           });
//         }
//         next();
//       } catch (error) {
//         next(error);
//       }
//     },
//   );
// }

// src/common/middlewares/post-findOneAndUpdate-update-related.middleware.ts
import { Schema, Model, Document, CallbackError } from 'mongoose';

/**
 * Middleware post-findOneAndUpdate para actualizar documentos relacionados.
 *
 * Este middleware se ejecuta después de una operación `findOneAndUpdate` en un documento,
 * y actualiza documentos en un modelo relacionado basado en un campo común.
 *
 * @template T - Tipo del documento actualizado (el documento principal).
 * @template U - Tipo del documento relacionado (el documento a actualizar).
 * @param schema - El esquema de Mongoose al que se añade el middleware.
 * @param relatedModelName - Nombre del modelo relacionado que será actualizado.
 * @param field_idSchema_in_relatedModel - Nombre del campo en el modelo relacionado que coincide con el `_id` del documento actualizado.
 * @param getUpdateFields - Función que toma el documento actualizado y devuelve un objeto con los campos que deben actualizarse en el modelo relacionado.
 */
export function postUpdate_updateIn_relatedModel_Middleware<
  T extends Document,
  U extends Document,
>(
  schema: Schema<T>,
  relatedModelName: string,
  field_idSchema_in_relatedModel: string,
  getUpdateFields: (doc: T) => Record<string, string | number>,
): void {
  schema.post<T>(
    'findOneAndUpdate',
    async function (doc: T | null, next: (err?: CallbackError) => void) {
      try {
        if (doc) {
          // Obtiene el modelo relacionado utilizando el nombre proporcionado
          const relatedModel = this.model(relatedModelName) as Model<U>;

          // Define la consulta para encontrar documentos relacionados
          const query = { [field_idSchema_in_relatedModel]: doc['_id'] };

          // Genera los campos de actualización usando la función proporcionada
          const update = getUpdateFields(doc);

          // Ejecuta la actualización en los documentos relacionados
          await relatedModel.collection.updateMany(query, {
            $set: update,
          });
        }
        // Continúa con el siguiente middleware o finaliza el proceso
        next();
      } catch (error) {
        // Pasa cualquier error al siguiente middleware para manejo
        next(error);
      }
    },
  );
}

/**
 * Ejemplo de aplicación del middleware en un esquema.
 *
 * ```typescript
 * postUpdate_updateIn_relatedModel_Middleware<CursoDocument, CursoCompradoDocument>(
 *   CursoSchema,               // Esquema al que se aplica el middleware
 *   CursoComprado.name,        // Nombre del modelo relacionado
 *   'courseId',                // Campo en CursoComprado que coincide con `_id` de Curso
 *   (doc: CursoDocument) => ({
 *     courseTitle: doc.titulo, // Campos a actualizar en CursoComprado
 *   }),
 * );
 * ```
 */
