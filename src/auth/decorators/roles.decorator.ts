import { SetMetadata } from '@nestjs/common';
import { RolEnum } from '../enums/roles.model';

export const ROLES_KEY = 'roles';
export const RolesDec = (...rolesInput: RolEnum[]) =>
  SetMetadata(ROLES_KEY, rolesInput);
// 667cdc15458e34ec1fc82aa1
// 667cdc15458e34ec1fc82aa1
