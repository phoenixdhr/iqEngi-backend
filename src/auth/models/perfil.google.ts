export interface ProfileGoogle {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: {
    value: string;
    verified: boolean;
  }[];
  photos: {
    value: string;
  }[];
  provider: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture?: string;
    email: string;
    email_verified: boolean;
  };
}

export interface UserAuth {
  email: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  picture?: string;
}

export interface UserGoogle extends UserAuth {
  accessToken?: string;
  refreshToken?: string;
}
