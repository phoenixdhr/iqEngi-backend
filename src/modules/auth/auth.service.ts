import { Inject, Injectable } from '@nestjs/common';
import { UserRequest } from './entities/user-request.entity';
import { IPayload } from './interfaces/jwt-requet-payload.interface';
import { UserJwtOutput } from './entities/user-jwt.output';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import configEnv from 'src/common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(configEnv.KEY) readonly configService: ConfigType<typeof configEnv>,
  ) {}

  //#region JWT Functions ya no es necesario, se puede eleminar - console.log
  /**
   * Genera un token JWT para un usuario.
   * @param user - Datos del usuario, incluyendo roles y ID.
   * @returns Un objeto que contiene el token JWT y la información del usuario.
   */
  async generateJWT(user: UserRequest): Promise<UserJwtOutput> {
    const payload: IPayload = { roles: user.roles, sub: user._id };

    // Firmamos el token con los datos del payload
    const token = this.jwtService.sign(payload);

    return {
      user,
      accessToken: token,
    };
  }

  /**
   * Genera un token JWT y configura las cookies de autenticación.
   * @param res - Objeto de respuesta HTTP.
   * @param user - Datos del usuario autenticado.
   * @param googleToken - (Opcional) Token de acceso de Google.
   * @param googleRefreshToken - (Opcional) Refresh token de Google.
   * @returns El usuario autenticado.
   */
  async handleLogin(
    res: Response,
    user: UserRequest,
    googleToken?: string,
    googleRefreshToken?: string,
  ): Promise<UserRequest> {
    // Generar token JWT para el usuario
    const payload = { sub: user._id, roles: user.roles };
    const jwtToken = this.jwtService.sign(payload);

    const isProduction = this.configService.environment === 'production';

    // Configurar el token JWT en la cookie
    res.cookie('jwt_token', jwtToken, {
      httpOnly: true,
      secure: isProduction, // this.configService.environment === 'production',
      sameSite: isProduction ? 'strict' : 'lax', // Cambiado a 'strict' para mayor seguridad  antes era :        this.configService.environment === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Configurar las cookies para los tokens de Google si se proporcionan
    if (googleToken) {
      res.cookie('access_token', googleToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // Cambiado a 'strict' para mayor seguridad
        // sameSite: 'none', // Cambiado a 'strict' para mayor seguridad
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    if (googleRefreshToken) {
      res.cookie('refresh_token', googleRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // Cambiado a 'strict' para mayor seguridad
        // sameSite: 'none', // Cambiado a 'strict' para mayor seguridad
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Retornar el usuario autenticado
    return user;
  }

  //#region Refresh Token Functions (No implementadas)
  /**
   * Genera tokens de acceso y de refresco para el usuario.
   * @param user - Datos del usuario, incluyendo ID y roles.
   * @returns Un objeto con accessToken y refreshToken.
   */
  // async generateTokens(
  //   user: UserRequest,
  // ): Promise<{ accessToken: string; refreshToken: string }> {
  //   const payload = { sub: user._id, roles: user.roles };

  //   // Genera el access token con una duración corta (15 minutos).
  //   const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

  //   // Genera el refresh token con una duración más larga (7 días).
  //   const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  //   // Opcional: Almacena el refresh token de forma segura en la base de datos (ej. encriptado).
  //   await this.userService.storeRefreshToken(user._id, refreshToken);

  //   return { accessToken, refreshToken };
  // }

  /**
   * Actualiza el access token usando el refresh token.
   * @param refreshToken - Token de refresco del usuario.
   * @returns Un nuevo accessToken si el refreshToken es válido.
   * @throws UnauthorizedException si el refreshToken es inválido o ha expirado.
   */
  // async refreshToken(refreshToken: string): Promise<string> {
  //   try {
  //     // Verificamos el refresh token; lanzará error si es inválido o ha expirado.
  //     const decoded = this.jwtService.verify(refreshToken);

  //     // Busca el usuario en la base de datos utilizando el ID del payload.
  //     const user = await this.userService.findById(decoded.sub);

  //     // Genera un nuevo access token con una duración corta.
  //     const newAccessToken = this.jwtService.sign(
  //       { sub: user._id, roles: user.roles },
  //       { expiresIn: '15m' },
  //     );

  //     return newAccessToken;
  //   } catch (error) {
  //     // Excepción específica para evitar detalles sobre el error.
  //     throw new UnauthorizedException('Invalid or expired refresh token');
  //   }
  // }
}
