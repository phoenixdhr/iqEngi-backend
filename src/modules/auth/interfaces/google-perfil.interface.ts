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

export interface TokenExpiredResponse {
  issued_to?: string;
  audience?: string;
  user_id?: string;
  scope?: string;
  expires_in?: number;
  email?: string;
  verified_email?: boolean;
  access_type?: string;
}
