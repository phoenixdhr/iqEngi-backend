// src/common/enums/user-status.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED', // Opcional: Otros estados según necesidad
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'Estados de un usuario',
});
