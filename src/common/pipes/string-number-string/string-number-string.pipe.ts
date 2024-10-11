import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class StringNumberStringPipe implements PipeTransform {
  transform(value: string) {
    const valueNumber = parseInt(value, 10);
    if (isNaN(valueNumber)) {
      throw new BadRequestException(`El valor ${value} no es un número`);
    }
    const valuestring = valueNumber.toString();

    return valuestring;
  }
}
