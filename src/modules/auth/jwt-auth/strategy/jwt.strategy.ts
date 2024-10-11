import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configEnv from 'src/common/enviroments/configEnv';
import { JwtAuthService } from '../jwt-auth.service';
import { JwtPayload } from '../../interfaces/jwt-requet-payload.interface';
import { UserRequest } from '../../entities/user-request.entity';
// import { UsuariosService } from 'src/usuarios/services/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(configEnv.KEY)
    readonly configService: ConfigType<typeof configEnv>,
    readonly jwtAuthService: JwtAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserRequest> {
    // valido si el usuario existe
    const usuario = await this.jwtAuthService.validatePayload(payload);

    const user = {
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

    console.log('user', user);
    return user;
  }
}
