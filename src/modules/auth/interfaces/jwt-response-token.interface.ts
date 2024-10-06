import { UserRequest } from '../entities/user-request.entity';

export interface JwtResponse {
  accessToken: string;
  user: UserRequest;
}
