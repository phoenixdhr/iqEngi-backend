import { Injectable } from '@nestjs/common';

import { UsuarioService } from 'src/modules/usuario/services/usuario.service';
//import { PerfilResponse, UserGoogle } from '../interfaces/google-user.interface';
import { TokenExpiredResponse } from '../interfaces/google-perfil.interface';
import { PerfilResponse } from '../interfaces/google-user.interface';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly usuariosService: UsuarioService) {}

  // async googleLogin(req: Request) {
  //   if (!req.user) {
  //     return 'No user from google :C';
  //   }

  //   return {
  //     message: 'User information from google :)',
  //     user: req.user,
  //   };
  // }

  // #region Check Google Guard
  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(
        'https://accounts.google.com/o/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        },
      );

      const data = (await response.json()) as { access_token: string };
      console.log('data1                ', data);
      // Retorna el nuevo token de acceso

      return data.access_token;
    } catch (error) {
      // Lanza un error si no se puede obtener el nuevo token de acceso
      throw new Error(`Failed to validate the access token: ${error.message}`);
    }
  }

  async getProfile(token: string): Promise<PerfilResponse> {
    try {
      // Realiza una solicitud GET a la API de Google OAuth 2.0 para obtener el perfil del usuario
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );

      const data: PerfilResponse = await response.json();

      return data;
    } catch (error) {
      // Lanza un error si no se puede obtener el perfil del usuario
      throw new Error(`Failed to validate the access token: ${error.message}`);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      // Realiza una solicitud GET a la API de Google OAuth 2.0 para validar el token de acceso
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const data: TokenExpiredResponse = await response.json();
      const expiredIn = data.expires_in;

      if (!expiredIn || expiredIn < 0) {
        return true;
      }
    } catch (error) {
      throw new Error(`Failed to validate the access token: ${error.message}`);
      // Lanza un error si no se puede validar el token de acceso
      return false;
    }
  }

  async revokeGoogleToken(token: string): Promise<void> {
    try {
      // Realiza una solicitud GET a la API de Google OAuth 2.0 para revocar el token de acceso
      await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    } catch (error) {
      // Lanza un error si no se puede revocar el token de acceso
      throw new Error(`Failed to validate the access token: ${error.message}`);
    }
  }
}
