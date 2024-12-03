// import {
//   Schema,
//   Document,
//   CallbackError,
//   Model,
//   Query,
//   FilterQuery,
//   UpdateQuery,
// } from 'mongoose';

// /**
//  * Middleware `pre` para sincronizar campos relacionados en modelos asociados antes de un `findOneAndUpdate`.
//  *
//  * @template PrimaryDocType - Tipo del documento principal en el esquema actual (debe extender de `Document`).
//  * @template RelatedDocType - Tipo del documento relacionado (debe extender de `Document`).
//  * @template RelatedForeignKey - Clave en el modelo relacionado que referencia al esquema principal.
//  *
//  * @param schema - El esquema de Mongoose al que se adjunta el middleware.
//  * @param relatedModelName - Nombre del modelo relacionado a actualizar (como aparece en la base de datos).
//  * @param relatedModelForeignKey - Campo en el modelo relacionado que actúa como referencia al documento principal.
//  * @param mapFieldsForUpdate - Función que determina los campos a actualizar en el modelo relacionado,
//  * basada en el documento principal antes de la actualización.
//  *
//  * La función `mapFieldsForUpdate` tiene la siguiente firma:
//  * `(primaryDoc: PrimaryDocType) => Partial<RelatedDocType>`
//  *
//  * Donde:
//  * - `primaryDoc` es el documento original que se está actualizando.
//  * - El retorno es un subconjunto de los campos del documento relacionado que deben ser actualizados.
//  */
// export function addPreUpdateSyncMiddleware<
//   PrimaryDocType extends Document, // Documento principal
//   RelatedDocType extends Document, // Documento relacionado
//   RelatedForeignKey extends keyof RelatedDocType, // Clave de referencia en el modelo relacionado
// >(
//   schema: Schema<PrimaryDocType>,
//   relatedModelName: string,
//   relatedModelForeignKey: RelatedForeignKey,
//   mapFieldsForUpdate: (primaryDoc: PrimaryDocType) => Partial<RelatedDocType>, // Retorna un subconjunto de campos a actualizar
// ): void {
//   schema.pre<Query<PrimaryDocType, PrimaryDocType>>(
//     'findOneAndUpdate',
//     async function (
//       this: Query<PrimaryDocType, PrimaryDocType>,
//       next: (err?: CallbackError) => void,
//     ) {
//       try {
//         // Obtener los datos de actualización
//         const updateData: UpdateQuery<PrimaryDocType> = this.getUpdate();
//         // obten el id del documento que se esta actualizando
//         const idCourse = this.getQuery()._id;
//         console.log('idCourse_____________');
//         console.log(idCourse);
//         console.log('updateData:');
//         console.log(updateData);
//         console.log('___________________________________');

//         // Verificar si hay campos relevantes en la actualización
//         // const fieldsToUpdate = Object.keys(updateData?.$set || {}); // Campos especificados en `$set`
//         const fieldsToUpdate = Object.keys(updateData || {}); // Campos especificados en `$set`

//         const relevantFields = Object.keys(
//           mapFieldsForUpdate({} as PrimaryDocType), // Generar los campos relevantes
//         );
//         console.log('Campos a actualizar:');
//         console.log(fieldsToUpdate);
//         console.log('___________________________________');
//         console.log('Campos relevantes:');
//         console.log(relevantFields);

//         // Verificar si hay una intersección entre los campos actualizados y los relevantes
//         const hasRelevantUpdates = fieldsToUpdate.some((field) =>
//           relevantFields.includes(field),
//         );

//         // Si no hay campos relevantes en la actualización, saltar el middleware
//         if (!hasRelevantUpdates) {
//           console.log(
//             'No hay actualizaciones relevantes, saltando middleware.',
//           );
//           return next();
//         }

//         // Opciones para obtener el documento original antes de la actualización.
//         const queryOptions = { new: false, ...this.getOptions() };
//         console.log('___________________________________');

//         console.log('Datos de actualización:', queryOptions);

//         // Buscar el documento original antes de aplicar los cambios.
//         const originalDoc = await this.model
//           .findOne(this.getFilter(), null, queryOptions)
//           .exec();
//         console.log('___________________________________');
//         console.log('Documento original:');
//         console.log(originalDoc);

//         if (originalDoc) {
//           // Generar los campos a actualizar en el modelo relacionado.
//           const relatedFieldsToUpdate = mapFieldsForUpdate(
//             updateData as unknown as PrimaryDocType,
//           );

//           console.log('___________________________________');
//           console.log('Campos a actualizar en el modelo relacionado:');
//           console.log(relatedFieldsToUpdate);

//           // Obtener el modelo relacionado usando el nombre proporcionado.
//           const relatedModel = this.model.db.model(
//             relatedModelName,
//           ) as Model<RelatedDocType>;

//           console.log('Modelo relacionado encontrado:', relatedModelName);

//           // Construir la consulta para encontrar los documentos relacionados.
//           const relatedModelFilter: FilterQuery<RelatedDocType> = {
//             [relatedModelForeignKey]: originalDoc._id,
//           } as FilterQuery<RelatedDocType>;
//           console.log('___________________________________');
//           console.log('Filtro para documentos relacionados:');
//           console.log(relatedModelFilter);

//           // Actualizar los documentos relacionados con los campos mapeados.
//           await relatedModel.updateMany(relatedModelFilter, {
//             $set: relatedFieldsToUpdate,
//           });
//         }

//         // Continuar con la ejecución del middleware.
//         next();
//       } catch (error) {
//         // Pasar el error al controlador de errores.
//         next(error);
//       }
//     },
//   );
// }

import {
  Schema,
  Document,
  CallbackError,
  Model,
  Query,
  FilterQuery,
  UpdateQuery,
} from 'mongoose';

/**
 * Middleware `pre` para sincronizar campos relacionados en modelos asociados antes de un `findOneAndUpdate`.
 *
 * Este middleware permite actualizar automáticamente documentos relacionados en otro modelo cuando
 * se realiza una actualización (`findOneAndUpdate`) en el modelo principal.
 *
 * @template PrimaryDocType - Tipo del documento principal en el esquema actual (debe extender de `Document`).
 * @template RelatedDocType - Tipo del documento relacionado (debe extender de `Document`).
 * @template RelatedForeignKey - Clave en el modelo relacionado que referencia al esquema principal.
 *
 * @param schema - El esquema de Mongoose al que se adjunta el middleware.
 * @param relatedModelName - Nombre del modelo relacionado a actualizar (como aparece en la base de datos).
 * @param relatedModelForeignKey - Campo en el modelo relacionado que actúa como referencia al documento principal.
 * @param mapFieldsForUpdate - Función que determina los campos a actualizar en el modelo relacionado,
 * basada en el documento principal antes de la actualización. Retorna un subconjunto de los campos del documento relacionado.
 */
export function addPreUpdateSyncMiddleware<
  PrimaryDocType extends Document,
  RelatedDocType extends Document,
  RelatedForeignKey extends keyof RelatedDocType,
>(
  schema: Schema<PrimaryDocType>,
  relatedModelName: string,
  relatedModelForeignKey: RelatedForeignKey,
  mapFieldsForUpdate: (primaryDoc: PrimaryDocType) => Partial<RelatedDocType>,
): void {
  schema.pre<Query<PrimaryDocType, PrimaryDocType>>(
    'findOneAndUpdate',
    async function (
      this: Query<PrimaryDocType, PrimaryDocType>,
      next: (err?: CallbackError) => void,
    ) {
      try {
        // Obtener los datos de actualización.
        const updateData: UpdateQuery<PrimaryDocType> = this.getUpdate();

        // Obtener los campos que se están actualizando.
        const fieldsToUpdate = Object.keys(updateData || {});

        // Obtener los campos relevantes definidos en la función `mapFieldsForUpdate`.
        const relevantFields = Object.keys(
          mapFieldsForUpdate({} as PrimaryDocType),
        );

        // Verificar si alguno de los campos actualizados es relevante.
        const hasRelevantUpdates = fieldsToUpdate.some((field) =>
          relevantFields.includes(field),
        );

        // Si no hay actualizaciones relevantes, omitir este middleware.
        if (!hasRelevantUpdates) {
          return next();
        }

        // Opciones para obtener el documento original antes de la actualización.
        const queryOptions = { new: false, ...this.getOptions() };

        // Buscar el documento original antes de aplicar los cambios.
        const originalDoc = await this.model
          .findOne(this.getFilter(), null, queryOptions)
          .exec();

        if (originalDoc) {
          // Generar los campos que deben actualizarse en el modelo relacionado.
          const relatedFieldsToUpdate = mapFieldsForUpdate(
            updateData as unknown as PrimaryDocType,
          );

          // Obtener el modelo relacionado por su nombre.
          const relatedModel = this.model.db.model(
            relatedModelName,
          ) as Model<RelatedDocType>;

          // Construir la consulta para filtrar los documentos relacionados.
          const relatedModelFilter: FilterQuery<RelatedDocType> = {
            [relatedModelForeignKey]: originalDoc._id,
          } as FilterQuery<RelatedDocType>;

          // Actualizar los documentos relacionados.
          await relatedModel.updateMany(relatedModelFilter, {
            $set: relatedFieldsToUpdate,
          });
        }

        // Continuar con la ejecución del middleware.
        next();
      } catch (error) {
        // Pasar el error al controlador de errores.
        next(error);
      }
    },
  );
}
