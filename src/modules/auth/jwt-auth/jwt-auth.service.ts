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
import configEnv from 'src/common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService, // Inyección de dependencias de UsuarioService para gestionar usuarios.
    private readonly jwtService: JwtService, // Inyección de dependencias de JwtService para gestionar JWT.
    @Inject(configEnv.KEY) readonly configService: ConfigType<typeof configEnv>,
  ) {}

  /**
   * Registro de un nuevo usuario.
   * @param createUserDto - Datos para la creación del usuario.
   * @returns Usuario creado.
   */
  async signup(createUserDto: CreateUsuarioInput): Promise<UsuarioOutput> {
    return await this.usuarioService.create(createUserDto);
  }

  /**
   * Inicio de sesión de un usuario.
   * @param user - Datos del usuario.
   * @returns Un objeto con el token JWT.
   */
  async login(user: UserRequest): Promise<UserJwtOutput> {
    return this.generateJWT(user);
  }

  /**
   * Genera un token JWT para un usuario.
   * @param user - Datos del usuario.
   * @returns Un objeto con el token JWT y los datos del usuario.
   */
  async generateJWT(user: UserRequest): Promise<UserJwtOutput> {
    const payload: IPayload = { roles: user.roles, sub: user._id };
    const token = this.jwtService.sign(payload); // Firma el token con los datos del payload.

    return {
      user,
      accessToken: token,
    };
  }

  /**
   * Valida las credenciales del usuario.
   * Usado en la estrategia Local de Passport para validar el login.
   * @param userPasswordInput - Datos de email y contraseña del usuario.
   * @returns Datos del usuario autenticado.
   * @throws UnauthorizedException - Si el usuario o contraseña no son válidos.
   */
  async validatePassword(
    userPasswordInput: LoginUserInput,
  ): Promise<UserRequest> {
    const { email, password } = userPasswordInput;
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

  /**
   * Valida el payload del JWT.
   * Usado en la estrategia JWT de Passport para validar el token.
   * @param payload - Datos del payload del JWT.
   * @returns Datos del usuario autenticado.
   * @throws UnauthorizedException - Si el usuario no existe.
   */
  async validatePayload(payload: IPayload): Promise<UsuarioOutput> {
    const user = await this.usuarioService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }
    return user;
  }
}
