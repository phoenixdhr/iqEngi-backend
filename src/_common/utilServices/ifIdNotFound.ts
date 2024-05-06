import { NotFoundException } from '@nestjs/common';

export function ifItNotFound(document: any, id: string) {
  const objeto = { id };
  if (!document) {
    throw new NotFoundException(
      `El documento con ${Object.keys(objeto)[0]} : ${id} no fue encontrado`,
    );
  }
}
