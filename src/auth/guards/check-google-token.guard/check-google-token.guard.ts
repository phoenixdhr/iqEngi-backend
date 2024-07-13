import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';

// Esta guard no usa una estrategia, solo verifica si los toquen son validos o los renueva, y devuelve true o false
@Injectable()
export class CheckGoogleTokenExpiryGuard implements CanActivate {
  // Inyecta el servicio de autenticación en el guard
  constructor(private readonly authService: AuthService) {}

  // Método canActivate que determina si se puede activar una ruta
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener el objeto de la solicitud HTTP desde el contexto de ejecución
    const request = context.switchToHttp().getRequest();
    // Obtener el objeto de la respuesta HTTP desde el contexto de ejecución
    const response = context.switchToHttp().getResponse();

    // Obtener el token de acceso de las cookies de la solicitud
    const accessToken = request.cookies['access_token'];

    // Si no se encuentra el token de acceso, lanzar una excepción de no autorizado
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    // Verificar si el token de acceso ha expirado
    const isAccessTokenExpired =
      await this.authService.isTokenExpired(accessToken);

    // Si el token de acceso ha expirado
    if (isAccessTokenExpired) {
      // Obtener el token de actualización de las cookies de la solicitud
      const refreshToken = request.cookies['refresh_token'];

      // Si no se encuentra el token de actualización, lanzar una excepción de no autorizado
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // Obtener un nuevo token de acceso utilizando el token de actualización
      const newAccessToken =
        await this.authService.getNewAccessToken(refreshToken);

      // Establecer el nuevo token de acceso en las cookies de la respuesta HTTP
      response.cookie('access_token', newAccessToken, { httpOnly: true });

      // Actualizar el objeto de cookies de la solicitud con el nuevo token de acceso
      request.cookies['access_token'] = newAccessToken;
    }

    // Permitir el acceso a la ruta solicitada
    return true;
  }
}
