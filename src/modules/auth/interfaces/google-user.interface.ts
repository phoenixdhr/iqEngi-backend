import { Types } from 'mongoose';
import { RolEnum } from 'src/common/enums';

export interface UserAuth {
  email: string;
  email_verified?: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

export interface UserGoogle extends UserAuth {
  email: string;
  email_verified: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string;
  isGoogleAuth?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface PerfilResponse {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface UserRequestGoogle extends UserAuth {
  email: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  picture?: string;
  isGoogleAuth?: boolean;
  accessToken?: string;
  refreshToken?: string;
  roles?: RolEnum[];
  _id?: Types.ObjectId;
}
