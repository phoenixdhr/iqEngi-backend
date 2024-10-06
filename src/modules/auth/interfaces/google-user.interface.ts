export interface UserAuth {
  email: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  picture?: string;
}

export interface UserGoogle extends UserAuth {
  email: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
}
