// // mongoose-utils.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Model } from 'mongoose';

// @Injectable()
// export class MongooseUtilsService {
//   // Método para añadir elementos a un array de cualquier documento
//   async pushToArray<T>(
//     model: Model<T>,
//     arrayName: string,
//     docId: string,
//     element: Array<any>,
//   ) {
//     const document = await model.findById(docId).exec();
//     document[arrayName].push(...element);

//     if (!document) {
//       throw new NotFoundException(
//         `Documento ${model.name} con ID ${docId} no encontrado`,
//       );
//     }

//     return document.save();
//   }

//   // Método para eliminar elementos de un array de cualquier documento
//   async pullFromArray<T>(
//     model: Model<T>,
//     arrayName: string,
//     docId: string,
//     element: Array<any>,
//   ) {
//     const document = await model.findById(docId).exec();
//     document[arrayName].pull(element);

//     if (!document) {
//       throw new NotFoundException(
//         `Documento ${model.name} con ID ${docId} no encontrado`,
//       );
//     }

//     return document.save();
//   }
// }

// mongoose-utils.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Document } from 'mongoose';

@Injectable()
export class MongooseUtilsService {
  // Método para añadir elementos a un array de cualquier documento
  async pushToArray<T extends Document>(
    model: Model<T>,
    docId: string,
    arrayName: keyof T & string,
    elements: Array<T[keyof T]>,
  ) {
    const document = await model.findById(docId).exec();
    if (!document) {
      throw new NotFoundException(
        `Documento ${model.modelName} con ID ${docId} no encontrado`,
      );
    }

    if (Array.isArray(document[arrayName])) {
      (document[arrayName] as any).push(...elements);
      document.save();
      return document;
    } else {
      throw new Error(`La propiedad ${arrayName} no es un array.`);
    }
  }

  // Método para eliminar elementos de un array de cualquier documento
  async pullFromArray<T extends Document>(
    model: Model<T>,
    docId: string,
    arrayName: keyof T & string,
    element: any,
  ) {
    const document = await model.findById(docId).exec();
    if (!document) {
      throw new NotFoundException(
        `Documento ${model.modelName} con ID ${docId} no encontrado`,
      );
    }

    if (Array.isArray(document[arrayName])) {
      (document[arrayName] as any).pull(element);
      document.save();
      return document;
    } else {
      throw new Error(`La propiedad ${arrayName} no es un array.`);
    }
  }
}
