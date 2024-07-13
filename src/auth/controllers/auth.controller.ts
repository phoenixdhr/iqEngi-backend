import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { GoogleOauthGuard } from '../guards/google-oauth.guard/google-oauth.guard';
import { UserGoogle } from '../models/perfil.google';
import { CheckGoogleTokenExpiryGuard } from '../guards/check-google-token.guard/check-google-token.guard';

@Controller('auth') // Define que esta clase es un controlador y el prefijo de las rutas es 'auth'
export class AuthController {
  constructor(private authService: AuthService) {} // Inyecta el servicio de autenticación

  @UseGuards(AuthGuard('local')) // Aplica el guard de autenticación local (nombre de usuario y contraseña)
  @HttpCode(HttpStatus.OK) // Establece el código de estado HTTP en 200 (OK)
  @Post('login') // Define una ruta POST en 'auth/login'
  async login(@Req() req: Request) {
    const user = req.user as Usuario; // Extrae el usuario autenticado del objeto Request
    return this.authService.generateJWT(user); // Genera y devuelve un token JWT para el usuario
  }

  @Get('login/google') // Define una ruta GET en 'auth/google'
  @UseGuards(GoogleOauthGuard) // Aplica el guard de autenticación para Google OAuth
  googleAuth() {
    // Este manejador redirige al usuario a la página de autenticación de Google
  }

  @Get('login/google/callback') // Define una ruta GET en 'auth/google/callback'
  @UseGuards(GoogleOauthGuard) // Aplica el guard de autenticación para Google OAuth
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
      const responsegetProfile = await this.authService.getProfile(accessToken);

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

    this.authService.revokeGoogleToken(refreshToken);

    // Redirigir al usuario a la página de inicio de sesión
    res.redirect('http://localhost:3000');
  }
}
