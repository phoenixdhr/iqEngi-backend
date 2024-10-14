import { UserRequest } from '../entities/user-request.entity';

export interface JwtResponse {
  accessToken: string;
  user: UserRequest;
}

export interface ITokens {
  access_token?: string;
  refresh_token?: string;
}
