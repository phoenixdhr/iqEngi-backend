import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioService } from 'src/modules/usuario/services/usuario.service';
import { CreateUserGoogleAuth } from 'src/modules/usuario/dtos/usuarios-dtos/create-usuario.input';
import { TokenExpiredResponse } from '../interfaces/google-perfil.interface';
import { ITokens } from '../interfaces/jwt-response-token.interface';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Busca o crea un usuario en la base de datos basado en el perfil de Google.
   * @param profile - Perfil del usuario obtenido de Google.
   * @returns El usuario creado o encontrado en la base de datos.
   */
  async findOrCreateUser(profile: CreateUserGoogleAuth) {
    // Crear o buscar al usuario en base al perfil de Google proporcionado.
    const user = await this.usuarioService.createOAuthUserEstudiante(profile);
    return user;
  }

  /**
   * Obtiene un nuevo token de acceso utilizando el refresh token de Google.
   * @param refreshToken - El token de actualización proporcionado por Google.
   * @returns El nuevo token de acceso.
   * @throws InternalServerErrorException si no se puede obtener el token de acceso.
   */
  async getTokens(refreshToken: string): Promise<string> {
    try {
      // Solicitud POST a Google para obtener un nuevo token de acceso.
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

      if (!response.ok) {
        // Captura el error con el código de estado y el mensaje.
        const errorText = await response.text();
        throw new InternalServerErrorException(
          `Error al obtener tokens de Google: ${errorText}`,
        );
      }

      const data: ITokens = await response.json();
      return data.access_token;
    } catch (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener un nuevo token de acceso de Google: ${error.message}`,
      );
    }
  }

  /**
   * Verifica si un token de acceso de Google ha expirado.
   * @param token - El token de acceso de Google.
   * @returns Un booleano que indica si el token ha expirado.
   * @throws UnauthorizedException si el token no es válido o ha expirado.
   */
  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );
      if (!response.ok) {
        throw new UnauthorizedException('Token de acceso inválido o expirado');
      }

      const data: TokenExpiredResponse = await response.json();

      // Verifica el tiempo de expiración del token; si `expires_in` es 0 o negativo, el token ha expirado.
      return data.expires_in <= 0;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al validar el token de acceso: ${error.message}`,
      );
    }
  }

  /**
   * Revoca un token de acceso de Google para invalidarlo.
   * @param token - El token de acceso que se desea revocar.
   * @throws InternalServerErrorException si no se puede revocar el token.
   */
  async revokeGoogleToken(token: string): Promise<void> {
    try {
      const response = await fetch(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new InternalServerErrorException(
          `Error al revocar el token de acceso: ${errorText}`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `No se pudo revocar el token de acceso: ${error.message}`,
      );
    }
  }
}
