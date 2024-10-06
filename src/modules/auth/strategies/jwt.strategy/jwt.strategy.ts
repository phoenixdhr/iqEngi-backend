import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configEnv from 'src/common/enviroments/configEnv';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-requet-payload.interface';
import { AuthService } from 'src/modules/auth/services/auth.service';
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

  // async validate(payload: JwtPayload): Promise<UserRequest> {
  //   // valido si el usuario existe

  //   // creo el objeto user con los valores de la clase o interface UserGoogle
  //   // agrego el rol del usuario en el user
  //   console.log('ZZZZZZZZZZZZZZZZZZZZZZZZ');

  //   const usuario = await this.authService.validatePayload(payload);

  //   console.log('payload', payload);

  //   const user = {
  //     _id: payload.sub,
  //     roles: payload.roles,
  //     iat: payload.iat,
  //     exp: payload.exp,
  //     email: usuario.email,
  //     email_verified: usuario.email_verified,
  //     firstName: usuario.firstName,
  //     lastName: usuario.lastName,
  //     picture: usuario.picture,
  //   };

  //   console.log('user', user);
  //   return user;
  // }
}
