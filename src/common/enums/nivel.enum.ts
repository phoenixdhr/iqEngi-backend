import { registerEnumType } from '@nestjs/graphql';

export enum Nivel {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',
}

registerEnumType(Nivel, { name: 'Nivel', description: 'Niveles de un curso' });
