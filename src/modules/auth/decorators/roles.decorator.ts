import { SetMetadata } from '@nestjs/common';
import { RolEnum } from 'src/common/enums';

export const ROLES_KEY = 'roles';
export const RolesDec = (...rolesInput: RolEnum[]) =>
  SetMetadata(ROLES_KEY, rolesInput);
