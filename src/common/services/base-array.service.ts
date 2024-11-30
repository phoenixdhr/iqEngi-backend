import { Model, Types, UpdateQuery } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { IdInterface } from '../interfaces/id.interface';

export abstract class BaseArrayService<
  ModelGeneral,
  DtoArrayFielgGeneral,
  ArrayFielgGeneral,
> {
  constructor(protected readonly model: Model<ModelGeneral>) {}

  /**
   * Valida si el campo es un array en el esquema y que sus elementos tengan _id
   */
  private validateArrayField<ArrayFieldGeneral extends keyof ModelGeneral>(
    arrayName: ArrayFieldGeneral,
  ): void {
    const schemaPath = this.model.schema.path(String(arrayName));

    console.log('schemaPath', schemaPath);

    if (!schemaPath) {
      throw new InternalServerErrorException(
        `El campo "${String(arrayName)}" no existe en el esquema.`,
      );
    }

    if (schemaPath.instance !== 'Array') {
      throw new InternalServerErrorException(
        `El campo "${String(arrayName)}" no es un array.`,
      );
    }

    // // Verificar que los elementos del array tienen un campo _id
    // const arraySchemaType = schemaPath as ArrayFielgGEneral;
    // if (
    //   !arraySchemaType ||
    //   !arraySchemaType.schema ||
    //   !arraySchemaType.schema.path('_id')
    // ) {
    //   throw new InternalServerErrorException(
    //     `Los elementos del array "${String(arrayName)}" no tienen un campo "_id".`,
    //   );
    // }
  }

  /**
   * Añade un elemento a un array de cualquier documento
   */
  async pushToArray<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    updateBy: Types.ObjectId,
    arrayName: K,
    element: DtoArrayFielgGeneral,
  ): Promise<ArrayFielgGeneral> {
    // Validar que el campo sea un array y que sus elementos tengan _id
    this.validateArrayField(arrayName);

    const arrayFieldName = String(arrayName);

    // Definir la consulta de actualización con type assertion
    const update: UpdateQuery<ModelGeneral> = {
      $push: {
        [arrayFieldName]: element,
      },
    } as UpdateQuery<ModelGeneral>;

    // Buscar y actualizar el documento
    const updatedDoc = await this.model
      .findByIdAndUpdate(docId, { ...update, updateBy }, { new: true })
      .exec();

    if (!updatedDoc) {
      throw new NotFoundException(
        `No se encontró el documento con ID "${docId}"`,
      );
    }

    const arrayDoc = updatedDoc[arrayFieldName];
    const newElement = arrayDoc[arrayDoc.length - 1];

    return newElement;
  }

  /**
   * Actualiza un elemento en el array
   */
  async updateInArray<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    arrayName: K,
    elementId: Types.ObjectId,
    updateData: Partial<
      ModelGeneral[K] extends Types.Array<infer U> ? U : never
    >,
  ): Promise<ModelGeneral> {
    // Validar que el campo sea un array y que sus elementos tengan _id
    this.validateArrayField(arrayName);

    const arrayFieldName = String(arrayName);

    // Definir la consulta de actualización con type assertion
    const updateQuery: UpdateQuery<ModelGeneral> = {
      $set: {
        [`${arrayFieldName}.$[elem]`]: { ...updateData, _id: elementId },
      },
    } as UpdateQuery<ModelGeneral>;

    // Buscar y actualizar el documento con filtros de array
    const document = await this.model
      .findOneAndUpdate({ _id: docId }, updateQuery, {
        new: true,
        arrayFilters: [{ 'elem._id': elementId }],
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.modelName} con ID ${docId} no encontrado`,
      );
    }

    return document as ModelGeneral;
  }

  /**
   * Elimina un elemento de un array de cualquier documento
   */
  async pullFromArray<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    arrayName: K,
    elementId: Types.ObjectId,
  ): Promise<ModelGeneral> {
    // Validar que el campo sea un array y que sus elementos tengan _id
    this.validateArrayField(arrayName);

    const arrayFieldName = String(arrayName);

    // Definir la consulta de actualización con type assertion
    const update: UpdateQuery<ModelGeneral> = {
      $pull: {
        [arrayFieldName]: { _id: elementId },
      },
    } as UpdateQuery<ModelGeneral>;

    // Buscar y actualizar el documento
    const updatedDoc = await this.model
      .findByIdAndUpdate(docId, update, { new: true })
      .exec();

    if (!updatedDoc) {
      throw new NotFoundException(
        `No se encontró el documento con ID "${docId}"`,
      );
    }

    return updatedDoc as ModelGeneral;
  }
}
