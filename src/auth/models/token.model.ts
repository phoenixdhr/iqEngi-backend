import { RolEnum } from '../enums/roles.model';

export interface JwtPayload {
  roles: [RolEnum];
  sub: string;
  iat: number;
  exp: number;
}
