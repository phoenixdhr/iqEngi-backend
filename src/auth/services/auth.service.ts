import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserPasswordDto } from 'src/usuarios/dtos/usuarios.dto';
import { UsuariosService } from 'src/usuarios/services/usuarios.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PayloadToken } from '../models/token.model';
import { Request } from 'express';
import { UserGoogle } from '../models/perfil.google';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userPassword: UserPasswordDto): Promise<object> {
    const user = await this.usuariosService.findByEmail(userPassword.email);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword.password,
      user.hashPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, ...result } = user.toObject();
    return result;
  }

  async generateJWT(user: Usuario): Promise<object> {
    const payload: PayloadToken = { rol: user.rol, sub: user._id };

    const firma = this.jwtService.sign(payload);

    return {
      access_token: firma,
      user,
    };
  }

  googleLogin(req: Request) {
    if (!req.user) {
      return 'No user from google :C';
    }

    return {
      message: 'User information from google :)',
      user: req.user,
    };
  }

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

      const data = await response.json();

      // Retorna el nuevo token de acceso

      return data.access_token;
    } catch (error) {
      // Lanza un error si no se puede obtener el nuevo token de acceso
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string): Promise<UserGoogle> {
    try {
      // Realiza una solicitud GET a la API de Google OAuth 2.0 para obtener el perfil del usuario
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );

      return await response.json();
    } catch (error) {
      // Lanza un error si no se puede obtener el perfil del usuario
      throw new Error('Failed to fetch user profile.');
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      // Realiza una solicitud GET a la API de Google OAuth 2.0 para validar el token de acceso
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const data = await response.json();

      const expiredIn = data.expires_in;

      if (!expiredIn || expiredIn < 0) {
        return true;
      }
    } catch (error) {
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
      throw new Error('Failed to revoke the access token.');
    }
  }
}
