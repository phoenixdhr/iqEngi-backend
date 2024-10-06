import { RolEnum } from 'src/common/enums/rol.enum';

export interface IPayload {
  roles: [RolEnum];
  sub: string;
}

export interface JwtPayload extends IPayload {
  roles: [RolEnum];
  sub: string;
  iat: number;
  exp: number;
}
