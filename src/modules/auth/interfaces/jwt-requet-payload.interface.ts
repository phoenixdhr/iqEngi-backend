import { Types } from 'mongoose';
import { RolEnum } from 'src/common/enums/rol.enum';

export interface IPayload {
  roles: [RolEnum];
  sub: Types.ObjectId;
}

export interface JwtPayload extends IPayload {
  roles: [RolEnum];
  sub: Types.ObjectId;
  iat: number;
  exp: number;
}
