import { registerEnumType } from '@nestjs/graphql';

export enum RolEnum {
  ESTUDIANTE = 'estudiante',
  INSTRUCTOR = 'instructor',
  EDITOR = 'editor',
  ADMINISTRADOR = 'administrador',
  SUPERADMIN = 'superadmin',
}

// Registrar el enum para que esté disponible en el esquema de GraphQL
registerEnumType(RolEnum, {
  name: 'RolEnumGql', // nombre del enum en el esquema de GraphQL
  description: 'Roles disponibles para los usuarios', // descripción opcional
});
