import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
// import { Types } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isMongoId(value)) {
      throw new BadRequestException(
        `El valor ${value} no es un mongoId válido`,
      );
    }

    // convierte value que es un String a un typo ObjectId de MongoDB
    // const valueObjectId = new Types.ObjectId(value);
    // return valueObjectId;

    return value;
  }
}
