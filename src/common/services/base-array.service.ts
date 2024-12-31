import { Model, Types, UpdateQuery } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IdInterface } from '../interfaces/id.interface';

// import { IdInterface } from '../interfaces/id.interface';

export abstract class BaseArrayService<
  ModelGeneral,
  Dto_Create_SubModel,
  Dto_Update_submodelInput,
  SubModel extends IdInterface,
> {
  constructor(
    protected readonly model: Model<ModelGeneral>,
    protected readonly subModel: Model<SubModel>,
  ) {}

  /**
   * Valida si el campo es un array en el esquema y que sus elementos tengan _id
   */
  private validateArrayField<ArrayFieldGeneral extends keyof ModelGeneral>(
    fieldArrayName: ArrayFieldGeneral,
  ): void {
    const schemaPath = this.model.schema.path(String(fieldArrayName));

    if (!schemaPath) {
      throw new InternalServerErrorException(
        `El campo "${String(fieldArrayName)}" no existe en el esquema.`,
      );
    }

    if (schemaPath.instance !== 'Array') {
      throw new InternalServerErrorException(
        `El campo "${String(fieldArrayName)}" no es un array.`,
      );
    }
  }

  //#region create

  /**
   * Añade un elemento a un array de cualquier documento
   */
  async pushToArray<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    updateBy: Types.ObjectId,
    dto_Create_SubModel: Dto_Create_SubModel,
    fieldArrayName: K,
  ): Promise<SubModel> {
    // Validar que el campo sea un array y que sus elementos tengan _id
    this.validateArrayField(fieldArrayName);

    const arrayFieldName = String(fieldArrayName);

    // Definir la consulta de actualización con type assertion
    const update: UpdateQuery<ModelGeneral> = {
      $push: {
        [arrayFieldName]: dto_Create_SubModel,
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

  //#region find
  /**
   * Recupera un documento específico por su ID.
   * @param id - El ID del documento a buscar.
   * @returns El documento encontrado.
   * @throws NotFoundException si no se encuentra el documento.
   */
  async findById(
    idModel: Types.ObjectId,
    idSubModel: Types.ObjectId,
    fieldArrayName: keyof ModelGeneral,
  ): Promise<SubModel> {
    const document: ModelGeneral = await this.model.findById(idModel);

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name} con ID "${idModel}" no encontrado`,
      );
    }

    this.validateArrayField(fieldArrayName);

    const arraySubDocument = document[fieldArrayName] as unknown as SubModel[];

    const subdocument = arraySubDocument.find(
      (subDocument) => String(subDocument._id) == String(idSubModel),
    );

    if (!subdocument) {
      throw new NotFoundException(
        `Subdocumento ${this.subModel.collection.name} con ID "${idSubModel}" no encontrado en el documento ${this.model.collection.name} con ID "${idModel}"`,
      );
    }

    return subdocument;
  }

  //#region update
  /**
   * Actualiza un elemento en el array
   */
  async updateInArray<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    subDocId: Types.ObjectId,
    idUpdatedBy: Types.ObjectId,
    updateData: Dto_Update_submodelInput,
    fieldArrayName: K,
  ): Promise<SubModel> {
    const before = await this.findById(docId, subDocId, fieldArrayName);
    if (before.deleted) {
      throw new NotFoundException(
        `El documento ha sido eliminado" ${subDocId}"`,
      );
    }
    // Validar que el campo sea un array y que sus elementos tengan _id
    this.validateArrayField(fieldArrayName);

    const arrayFieldName = String(fieldArrayName);

    // Construir dinámicamente el objeto `$set`
    const updateFields: Record<string, string | Types.ObjectId | boolean> = {};
    // console.log('updateFields 1:', updateFields);

    for (const [key, value] of Object.entries(updateData)) {
      // Agregar cada clave del updateData como parte del `$set`
      updateFields[`${arrayFieldName}.$[elem].${key}`] = value;
      console.log(
        'key:',
        key,

        `       ${arrayFieldName}.$[elem].${key}`,
        '         value:',
        value,
      );
    }
    // console.log('updateFields 2:', updateFields);

    // Agregar el campo de auditoría `updatedBy`
    updateFields[`${arrayFieldName}.$[elem].updatedBy`] = idUpdatedBy;
    // console.log('updateFields 3:', updateFields);

    // // Definir la consulta de actualización con type assertion
    // const updateQuery: UpdateQuery<ModelGeneral> = {
    //   $set: {
    //     [`${arrayFieldName}.$[elem]`]: {
    //       ...updateData,
    //       _id: subDocId,
    //       updatedBy: idUpdatedBy,
    //     },
    //   },
    // } as UpdateQuery<ModelGeneral>;

    const updateQuery: UpdateQuery<ModelGeneral> = {
      $set: updateFields,
    };

    // Buscar y actualizar el documento con filtros de array
    const document = await this.model
      .findOneAndUpdate({ _id: docId }, updateQuery, {
        new: true,
        arrayFilters: [{ 'elem._id': subDocId }],
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.modelName} con ID ${docId} no encontrado`,
      );
    }

    const arraySubdocuments = document[fieldArrayName] as Array<SubModel>;

    const subDocument = arraySubdocuments.find(
      (sudDoc) => String(sudDoc._id) === String(subDocId),
    );
    console.log('document:                ', document);
    return subDocument;
  }

  //#region delete

  // crea un metodo llamado softdelete, que cambia la propiedad deleted a true de un elemento que esta dentro de un array
  async softDelete<K extends keyof ModelGeneral>(
    idDoc: Types.ObjectId,
    idSubDocDelete: Types.ObjectId,
    idThanos: Types.ObjectId,
    fieldArrayName: K,
  ): Promise<SubModel> {
    // Validar que el campo sea un array y que sus elementos tengan _id

    const subDocumentBefore = await this.findById(
      idDoc,
      idSubDocDelete,
      fieldArrayName,
    );

    if (subDocumentBefore.deleted) {
      throw new NotFoundException(
        `El subdocumento ya fue eliminado "${idSubDocDelete}"`,
      );
    }

    this.validateArrayField(fieldArrayName);

    const arrayFieldName = String(fieldArrayName);

    // Construir dinámicamente el objeto `$set`
    const updateFields: Record<string, string | Types.ObjectId | boolean> = {};

    updateFields[`${arrayFieldName}.$[elem].deleted`] = true;
    updateFields[`${arrayFieldName}.$[elem].deletedBy`] = idThanos;

    const updateQuery: UpdateQuery<ModelGeneral> = {
      $set: updateFields,
    };

    // Buscar y actualizar el documento con filtros de array
    const document = await this.model
      .findOneAndUpdate({ _id: idDoc }, updateQuery, {
        new: true,
        arrayFilters: [{ 'elem._id': idSubDocDelete }],
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.subModel.modelName} con ID ${idDoc} no encontrado`,
      );
    }

    const arraySubdocuments = document[fieldArrayName] as Array<SubModel>;

    const subDocument = arraySubdocuments.find(
      (sudDoc) => String(sudDoc._id) === String(idSubDocDelete),
    );

    return subDocument;
  }

  async restore<K extends keyof ModelGeneral>(
    idDoc: Types.ObjectId,
    idSubDocRestore: Types.ObjectId,
    updatedBy: Types.ObjectId,
    fieldArrayName: K,
  ): Promise<SubModel> {
    const dtoUPdate = { deleted: false } as Dto_Update_submodelInput;

    const before = await this.findById(idDoc, idSubDocRestore, fieldArrayName);
    if (!before.deleted) {
      throw new NotFoundException(
        `El documento ya fue restaurado" ${idSubDocRestore}"`,
      );
    }

    const arrayFieldName = String(fieldArrayName);

    // Construir dinámicamente el objeto `$set`
    const updateFields: Record<string, string | Types.ObjectId | boolean> = {};
    // console.log('updateFields 1:', updateFields);

    for (const [key, value] of Object.entries(dtoUPdate)) {
      // Agregar cada clave del updateData como parte del `$set`
      updateFields[`${arrayFieldName}.$[elem].${key}`] = value;
      console.log(
        'key:',
        key,

        `       ${arrayFieldName}.$[elem].${key}`,
        '         value:',
        value,
      );
    }
    // console.log('updateFields 2:', updateFields);

    // Agregar el campo de auditoría `updatedBy`
    updateFields[`${arrayFieldName}.$[elem].updatedBy`] = updatedBy;
    // console.log('updateFields 3:', updateFields);

    // // Definir la consulta de actualización con type assertion
    // const updateQuery: UpdateQuery<ModelGeneral> = {
    //   $set: {
    //     [`${arrayFieldName}.$[elem]`]: {
    //       ...updateData,
    //       _id: subDocId,
    //       updatedBy: idUpdatedBy,
    //     },
    //   },
    // } as UpdateQuery<ModelGeneral>;

    const updateQuery: UpdateQuery<ModelGeneral> = {
      $set: updateFields,
    };

    // Buscar y actualizar el documento con filtros de array
    const document = await this.model
      .findOneAndUpdate({ _id: idDoc }, updateQuery, {
        new: true,
        arrayFilters: [{ 'elem._id': idSubDocRestore }],
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.modelName} con ID ${idDoc} no encontrado`,
      );
    }

    const arraySubdocuments = document[fieldArrayName] as Array<SubModel>;

    const subDocument = arraySubdocuments.find(
      (sudDoc) => String(sudDoc._id) === String(idSubDocRestore),
    );
    console.log('document:                ', document);
    return subDocument;
  }

  async pullIfDeleted<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    elementId: Types.ObjectId,
    fieldArrayName: K,
  ): Promise<SubModel> {
    // Validar que el campo sea un array y que sus elementos tengan _id
    const subDocumentBefore = await this.findById(
      docId,
      elementId,
      fieldArrayName,
    );

    if (!subDocumentBefore.deleted) {
      throw new NotFoundException(
        `El subdocumento "${elementId}" debe estar cargado como deleted true para eliminarse`,
      );
    }
    const arrayFieldName = String(fieldArrayName);

    // Buscar el documento y validar si el elemento tiene `deleted: true`
    console.log('CHIPI');
    const document = await this.model
      .findOne({
        _id: docId,
        [`${arrayFieldName}._id`]: elementId,
        [`${arrayFieldName}.deleted`]: true,
      })
      .exec();

    console.log('CHAPA');
    if (!document) {
      throw new NotFoundException(
        `El elemento con ID "${elementId}" no se encuentra o no está marcado como eliminado en el documento con ID "${docId}"`,
      );
    }
    console.log('document[arrayFieldName]       ', document[arrayFieldName]);
    // Realizar el `pull` del elemento marcado como eliminado
    const update = {
      $pull: {
        [arrayFieldName]: { _id: elementId },
      },
    };

    // Aquí hacemos el type assertion explícito para evitar conflictos de tipos
    const updatedDoc = await this.model
      .findByIdAndUpdate(docId, update as UpdateQuery<ModelGeneral>, {
        new: true,
      })
      .exec();

    if (!updatedDoc) {
      throw new NotFoundException(
        `No se pudo actualizar el documento con ID "${docId}"`,
      );
    }

    const subdocument = document[arrayFieldName].find(
      (subDocument) => String(subDocument._id) === String(elementId),
    );

    console.log('subdocument:', subdocument);

    return subdocument;
  }

  async pullAllDeleted<K extends keyof ModelGeneral>(
    docId: Types.ObjectId,
    fieldArrayName: K,
  ): Promise<SubModel[]> {
    // Validar que el campo sea un array y que sus elementos tengan _id
    this.validateArrayField(fieldArrayName);

    const arrayFieldName = String(fieldArrayName);

    // Buscar el documento para obtener los elementos marcados como `deleted: true`
    const document = await this.model.findOne({ _id: docId }).exec();

    if (!document) {
      throw new NotFoundException(
        `Documento ${this.model.collection.name}con ID "${docId}" no encontrado`,
      );
    }

    const arraySubdocuments = document[arrayFieldName] as SubModel[];

    // // Filtrar los elementos que están marcados como `deleted: true`
    const deletedElements = arraySubdocuments.filter(
      (subDoc) => subDoc.deleted === true,
    );

    if (deletedElements.length === 0) {
      throw new NotFoundException(
        `No hay subdocumentos ${this.subModel.collection.name} marcados como eliminados"`,
      );
    }

    // Realizar el `pull` para eliminar todos los elementos marcados como `deleted: true`
    const update = {
      $pull: {
        [arrayFieldName]: { deleted: true },
      },
    };

    // Actualizar el documento en la base de datos
    const updatedDoc = await this.model
      .findByIdAndUpdate(docId, update as UpdateQuery<ModelGeneral>, {
        new: true,
      })
      .exec();

    if (!updatedDoc) {
      throw new NotFoundException(
        `No se pudo actualizar el documento con ID "${docId}"`,
      );
    }

    // Retornar los elementos eliminados
    return deletedElements;
  }
}
