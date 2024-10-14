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
import { UserRequest } from '../entities/user-request.entity';
import configEnv from 'src/common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';
import { AuthService as AuthService } from '../auth.service';
import { Response } from 'express';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService, // Servicio de usuario para operaciones de manejo de usuarios.
    private readonly authService: AuthService, // Servicio de autenticación para manejo de JWT.
    private readonly jwtService: JwtService, // Servicio para firmar y verificar JWT.
    @Inject(configEnv.KEY) readonly configService: ConfigType<typeof configEnv>,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema.
   * @param createUserDto - Datos necesarios para crear el usuario, como email y contraseña.
   * @returns El usuario recién creado.
   */
  async signup(createUserDto: CreateUsuarioInput): Promise<UsuarioOutput> {
    return await this.usuarioService.create(createUserDto);
  }

  /**
   * Inicia sesión de usuario y genera un token JWT.
   * @param user - Información del usuario.
   * @returns Un objeto que contiene el token JWT y los datos del usuario.
   */
  async login(
    loginUserInput: LoginUserInput,
    res: Response,
  ): Promise<UserRequest> {
    // Validación de credenciales del usuario

    const user = await this.validatePassword(loginUserInput);

    const userRequest = this.authService.handleLogin(res, user);
    return userRequest;
  }

  /**
   * Valida las credenciales del usuario durante el proceso de inicio de sesión.
   * @param userPasswordInput - Contiene el email y la contraseña del usuario.
   * @returns Los datos del usuario si las credenciales son correctas.
   * @throws UnauthorizedException - Si el usuario o la contraseña no son válidos.
   */
  async validatePassword(
    userPasswordInput: LoginUserInput,
  ): Promise<UserRequest> {
    const { email, password } = userPasswordInput;

    // Buscar al usuario por el email.
    const user = await this.usuarioService.findByEmail(email);

    // Verificación de que el usuario existe y la contraseña es válida.
    const isPasswordValid =
      user && (await bcrypt.compare(password, user.hashPassword));
    if (!isPasswordValid) {
      // Lanzar un error de autenticación genérico para evitar filtrado de información.
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // El usuario está autenticado; retornamos su información.
    return user as unknown as UserRequest;
  }

  /**
   * Valida el payload recibido en el JWT.
   * Usado en la estrategia JWT de Passport para verificar autenticidad del token.
   * @param payload - Payload del token JWT.
   * @returns Los datos del usuario si el token es válido.
   * @throws UnauthorizedException - Si el usuario no existe en el sistema.
   */
  async validatePayload(payload: IPayload): Promise<UsuarioOutput> {
    // Verifica que el usuario con el ID dado en el payload existe.
    const user = await this.usuarioService.findById(payload.sub);
    if (!user) {
      // Si el usuario no existe, lanza una excepción de autenticación.
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    // Retorna el usuario autenticado.
    return user;
  }
}
