// // mongoose-utils.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Model, Document } from 'mongoose';

// @Injectable()
// export class MongooseUtilsService {
//   // Método para añadir elementos a un array de cualquier documento
//   async pushToArray<T extends Document>(
//     model: Model<T>,
//     docId: string,
//     arrayName: keyof T & string,
//     elements: Array<T[keyof T]>,
//   ) {
//     const document = await model.findById(docId).exec();
//     if (!document) {
//       throw new NotFoundException(
//         `Documento ${model.modelName} con ID ${docId} no encontrado`,
//       );
//     }

//     if (Array.isArray(document[arrayName])) {
//       (document[arrayName] as any).push(...elements);
//       document.save();
//       return document;
//     } else {
//       throw new Error(`La propiedad ${arrayName} no es un array.`);
//     }
//   }

//   // Método para eliminar elementos de un array de cualquier documento
//   async pullFromArray<T extends Document>(
//     model: Model<T>,
//     docId: string,
//     arrayName: keyof T & string,
//     element: any,
//   ) {
//     const document = await model.findById(docId).exec();
//     if (!document) {
//       throw new NotFoundException(
//         `Documento ${model.modelName} con ID ${docId} no encontrado`,
//       );
//     }

//     if (Array.isArray(document[arrayName])) {
//       (document[arrayName] as any).pull(element);
//       document.save();
//       return document;
//     } else {
//       throw new Error(`La propiedad ${arrayName} no es un array.`);
//     }
//   }
// }

//______________________________________________
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Document, Types } from 'mongoose';

@Injectable()
export class MongooseUtilsService {
  // Método para añadir elementos a un array de cualquier documento
  async pushToArray<T extends Document, K extends keyof T>(
    model: Model<T>,
    docId: string,
    arrayName: K,
    elements: T[K] extends Types.Array<infer U> ? U[] : never,
  ): Promise<T> {
    const document = await model.findById(docId).exec();
    if (!document) {
      throw new NotFoundException(
        `Documento ${model.modelName} con ID ${docId} no encontrado`,
      );
    }

    const arrayField = document[arrayName];
    if (arrayField instanceof Types.Array) {
      arrayField.push(...elements);
      await document.save();
      return document;
    } else {
      throw new Error(
        `La propiedad ${String(arrayName)} no es un array de Mongoose.`,
      );
    }
  }

  // Método para eliminar elementos de un array de cualquier documento
  async pullFromArray<T extends Document, K extends keyof T>(
    model: Model<T>,
    docId: string,
    arrayName: K,
    element: T[K] extends Types.Array<infer U> ? U : never,
  ): Promise<T> {
    const document = await model.findById(docId).exec();
    if (!document) {
      throw new NotFoundException(`Documento ${model.modelName}
         con ID ${docId} no encontrado`);
    }

    const arrayField = document[arrayName];
    if (arrayField instanceof Types.Array) {
      arrayField.pull(element);
      await document.save();
      return document;
    } else {
      throw new Error(
        `La propiedad ${String(arrayName)} no es un array de Mongoose.`,
      );
    }
  }
}
