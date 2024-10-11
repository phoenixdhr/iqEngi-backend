import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CreateUsuarioInput } from 'src/modules/usuario/dtos/usuarios-dtos/create-usuario.input';
import { UsuarioOutput } from 'src/modules/usuario/dtos/usuarios-dtos/usuario.output';
import { LoginUserInput } from '../dtos/loginUser.input';
import { UsuarioService } from 'src/modules/usuario/services/usuario.service';
import { IPayload } from '../interfaces/jwt-requet-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserJwtOutput } from '../entities/user-jwt.output';
import { UserRequest } from '../entities/user-request.entity';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private usuarioService: UsuarioService,
    // private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  // Registro de nuevo usuario
  async signup(createUserDto: CreateUsuarioInput): Promise<UsuarioOutput> {
    const user = await this.usuarioService.create(createUserDto);
    return user;
  }

  // Inicio de sesión
  async login(user: UserRequest): Promise<UserJwtOutput> {
    return this.generateJWT(user);
  }

  async generateJWT(user: UserRequest): Promise<UserJwtOutput> {
    const payload: IPayload = { roles: user.roles, sub: user._id };

    const firma = this.jwtService.sign(payload);

    return {
      user,
      accessToken: firma,
    };
  }

  // Validación de usuario y contraseña, usado en la estrategia Local de Passport
  async validatePassword(
    userPasswordInput: LoginUserInput,
  ): Promise<UserRequest> {
    const { email, password } = userPasswordInput;
    console.log('user3333333333');
    const user = await this.usuarioService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    return user as unknown as UserRequest;
  }

  // validacion del payload, usado en la estrategia JWT de Passport
  async validatePayload(payload: IPayload): Promise<UsuarioOutput> {
    const user = await this.usuarioService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    // LA VERIFICACION DEL CORREO SE D EBE IMPLEMENTAR PARA VERIFICAR EL CORREO AQUI console.log('user', user);
    // if (user.email_verified === false) {
    //   throw new UnauthorizedException('Usuario no verificado, hacer click en el link de verificación enviado a su correo');
    // }

    return user;
  }
}
