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

export const allRoles = [
  RolEnum.ADMINISTRADOR,
  RolEnum.EDITOR,
  RolEnum.INSTRUCTOR,
  RolEnum.ESTUDIANTE,
  RolEnum.SUPERADMIN,
];

export const editorUp = [
  RolEnum.EDITOR,
  RolEnum.ADMINISTRADOR,
  RolEnum.SUPERADMIN,
];

export const administradorUp = [RolEnum.ADMINISTRADOR, RolEnum.SUPERADMIN];
