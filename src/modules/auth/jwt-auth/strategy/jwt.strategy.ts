import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configEnv from 'src/common/enviroments/configEnv';
import { JwtAuthService } from '../jwt-auth.service';
import { JwtPayload } from '../../interfaces/jwt-requet-payload.interface';
import { UserRequest } from '../../entities/user-request.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>, // Inyección de configuración para obtener la clave secreta JWT.
    private readonly jwtAuthService: JwtAuthService, // Servicio para autenticación con JWT.
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token de la cabecera Authorization.
      ignoreExpiration: false, // No permite el uso de tokens expirados.
      secretOrKey: configService.jwtSecret, // Utiliza la clave secreta para verificar el token.
    });
  }

  /**
   * Valida el payload del JWT.
   * Usado por Passport para validar que el token sea legítimo y el usuario exista.
   * @param payload - Datos decodificados del JWT.
   * @returns Objeto con los datos del usuario si es válido.
   */
  async validate(payload: JwtPayload): Promise<UserRequest> {
    // Validación del usuario existente en base al payload del JWT.
    const usuario = await this.jwtAuthService.validatePayload(payload);

    const user: UserRequest = {
      _id: payload.sub,
      roles: payload.roles,
      iat: payload.iat,
      exp: payload.exp,
      email: usuario.email,
      email_verified: usuario.email_verified,
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      picture: usuario.picture,
    };

    // Devuelve los datos del usuario en el formato esperado para Passport.
    return user;
  }
}
