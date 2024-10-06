import { registerEnumType } from '@nestjs/graphql';

export enum EstadoAccesoCurso {
  Activo = 'activo',
  Inactivo = 'inactivo',
}

registerEnumType(EstadoAccesoCurso, {
  name: 'EstadoAccesoCurso',
  description: 'Estados de acceso a un curso',
});
