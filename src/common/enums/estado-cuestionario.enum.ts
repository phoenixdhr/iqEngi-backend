import { registerEnumType } from '@nestjs/graphql';

export enum EstadoCuestionario {
  Aprobado = 'aprobado',
  Desaprobado = 'desaprobado',
  En_progreso = 'en_progreso',
  Sin_empezar = 'sin_empezar',
}

registerEnumType(EstadoCuestionario, {
  name: 'EstadoCuestionario',
  description: 'Estados de un cuestionario',
});
