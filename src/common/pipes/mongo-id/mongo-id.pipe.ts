// import {
//   ArgumentMetadata,
//   BadRequestException,
//   Injectable,
//   PipeTransform,
// } from '@nestjs/common';
// import { isMongoId } from 'class-validator';
// // import { Types } from 'mongoose';

// @Injectable()
// export class MongoIdPipe implements PipeTransform {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   transform(value: string, metadata: ArgumentMetadata) {
//     if (!isMongoId(value)) {
//       throw new BadRequestException(
//         `El valor ${value} no es un mongoId válido`,
//       );
//     }

//     // convierte value que es un String a un typo ObjectId de MongoDB
//     // const valueObjectId = new Types.ObjectId(value);
//     // return valueObjectId;

//     return value;
//   }
// }

// src/common/pipes/parse-object-id.pipe.ts
// src/common/pipes/parse-object-id.pipe.ts

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ArgumentMetadata } from '@nestjs/common/interfaces';

@Injectable()
export class IdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string, __metadata: ArgumentMetadata): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `El ID proporcionado (${value}) no es válido.`,
      );
    }
    return new Types.ObjectId(value);
  }
}
