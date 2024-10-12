import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthGuard } from './google-auth.guard/google-auth.guard';
import { UserGoogle } from '../interfaces/google-user.interface';
import { CheckGoogleTokenExpiryGuard } from './google-auth.guard/check-google-token.guard';

@Controller('auth') // Define que esta clase es un controlador y el prefijo de las rutas es 'auth'
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {} // Inyecta el servicio de autenticación

  @Get('login/google') // Define una ruta GET en 'auth/google'
  @UseGuards(GoogleAuthGuard) // Aplica el guard de autenticación para Google OAuth
  googleAuth() {
    // Este manejador redirige al usuario a la página de autenticación de Google
  }

  @Get('login/google/callback') // Define una ruta GET en 'auth/google/callback'
  @UseGuards(GoogleAuthGuard) // Aplica el guard de autenticación para Google OAuth
  googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    // Convertir el usuario autenticado a UserGoogle
    const user = req.user as UserGoogle;

    // Obtener los tokens de acceso y de refresco del usuario autenticado
    const googleToken = user.accessToken || 'no existe token access';
    const refreshToken = user.refreshToken || 'no existe token refresh';

    // Configurar cookies para los tokens con la opción httpOnly
    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    // Redirigir al usuario a la página de perfill
    res.redirect('http://localhost:3000/auth/profile');
  }

  @UseGuards(CheckGoogleTokenExpiryGuard) // Aplica el guard de autenticación JWT
  @Get('profile') // Define una ruta GET en 'auth/profile'
  async profile(@Req() req: Request) {
    // Obtener el token de acceso desde las cookies
    const accessToken = req.cookies['access_token'];

    if (accessToken) {
      // Si hay un token de acceso, obtener y devolver el perfil del usuario
      const responsegetProfile =
        await this.googleAuthService.getProfile(accessToken);

      return responsegetProfile;
    }

    throw new UnauthorizedException('Access token not found');
  }

  @Get('logout') // Define una ruta GET en 'auth/logout'
  logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['access_token'];
    // Eliminar las cookies de los tokens de acceso y de refresco
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    this.googleAuthService.revokeGoogleToken(refreshToken);

    // Redirigir al usuario a la página de inicio de sesión
    res.redirect('http://localhost:3000');
  }
}
