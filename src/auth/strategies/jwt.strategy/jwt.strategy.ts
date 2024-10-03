import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configEnv from 'src/_common/configEnv';
import { UserRequest } from 'src/auth/entities/type-gql/user_jwt.entity';
import { JwtPayload } from 'src/auth/models/token.model';
import { AuthService } from 'src/auth/services/auth.service';
// import { UsuariosService } from 'src/usuarios/services/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(configEnv.KEY)
    readonly configService: ConfigType<typeof configEnv>,
    readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserRequest> {
    // valido si el usuario existe

    // creo el objeto user con los valores de la clase o interface UserGoogle
    // agrego el rol del usuario en el user
    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZ');

    const usuario = await this.authService.validatePayload(payload);

    console.log('payload', payload);

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
