import {
  Controller,
  Get,
  Inject,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthGuard } from './google-auth.guard/google-auth.guard';
import { AuthService } from '../auth.service';
import { UserRequest } from '../entities/user-request.entity';
import { UserRequestGoogle } from '../interfaces/google-user.interface';
import { JwtGqlAuthGuard } from '../jwt-auth/jwt-auth.guard/jwt-auth.guard';
import configEnv from 'src/common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';

@Controller('auth') // Prefijo de las rutas del controlador: 'auth'
export class GoogleAuthController {
  constructor(
    private googleAuthService: GoogleAuthService, // Servicio de autenticación con Google
    private authService: AuthService, // Servicio de autenticación general
    @Inject(configEnv.KEY) readonly configService: ConfigType<typeof configEnv>,
  ) {}

  /**
   * Punto de entrada para iniciar la autenticación con Google.
   * Redirige al usuario a la página de inicio de sesión de Google.
   * @route GET auth/login/google
   */
  @Get('login/google')
  @UseGuards(GoogleAuthGuard) // Activa el guard para autenticación con Google OAuth
  googleAuth() {
    // Redirige automáticamente al usuario a Google para la autenticación OAuth
  }

  /**
   * Callback de Google después de la autenticación.
   * Genera un token JWT para el usuario autenticado y guarda las credenciales en cookies.
   * @param req - Objeto de solicitud que contiene los datos del usuario autenticado.
   * @param res - Objeto de respuesta para manejar redirecciones y cookies.
   * @route GET auth/login/google/callback
   */
  @Get('login/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // Convierte el usuario autenticado al tipo UserRequest
    const userRequest = req.user as UserRequest;

    // Convierte el usuario autenticado a UserRequestGoogle y obtiene las credenciales de Google
    const userGoogle = req.user as UserRequestGoogle;
    const googleToken = userGoogle.accessToken || null;
    const googleRefreshToken = userGoogle.refreshToken || null;

    // Uso de la función compartida para manejar el inicio de sesión y configurar cookies
    await this.authService.handleLogin(
      res,
      userRequest,
      googleToken,
      googleRefreshToken,
    );

    // Redirige al usuario a la página de perfil
    res.redirect(`${this.configService.dominioAPI}/auth/profile`);
  }

  /**
   * Muestra el perfil del usuario autenticado.
   * Protege el acceso usando un guard de autenticación JWT.
   * @param req - Objeto de solicitud que contiene los datos del usuario autenticado.
   * @returns Datos del usuario si está autenticado.
   * @throws UnauthorizedException - Si el usuario no está autenticado.
   * @route GET auth/profile
   */
  @UseGuards(JwtGqlAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const user = req.user as UserRequest;

    // Verifica si el usuario está autenticado; si no, lanza una excepción
    if (!user) {
      throw new UnauthorizedException('Access token no válido o no encontrado');
    }

    // Retorna el perfil del usuario autenticado
    return user;
  }

  /**
   * Cierra la sesión del usuario.
   * Elimina las cookies de tokens de acceso y refresco.
   * Redirige al usuario a la página de inicio después del cierre de sesión.
   * @param req - Objeto de solicitud (no usado).
   * @param res - Objeto de respuesta para manejar la redirección y eliminación de cookies.
   * @route GET auth/logout
   */
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    // Limpia las cookies de tokens de acceso, refresco y JWT
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('jwt_token');

    // Redirige al usuario a la página principal después de cerrar sesión
    res.redirect(`${this.configService.dominioAPI}`);
  }
}
