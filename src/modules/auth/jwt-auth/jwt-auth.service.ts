import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { UpdatePasswordInput } from 'src/modules/usuario/dtos/usuarios-dtos/update-password';
import { MailService } from 'src/modules/mail/mail.service';
import { Types } from 'mongoose';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService, // Servicio de usuario para operaciones de manejo de usuarios.
    private readonly authService: AuthService, // Servicio de autenticación para manejo de JWT.
    private readonly jwtService: JwtService, // Servicio para firmar y verificar JWT.
    private readonly mailService: MailService, // Servicio de correo para enviar emails.

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
   * Inicia sesión con usuario y contraseña, se genera un token JWT.
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
    const subId = payload.sub;
    const user = await this.usuarioService.findById(subId);
    if (!user) {
      // Si el usuario no existe, lanza una excepción de autenticación.
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    // Retorna el usuario autenticado.
    return user;
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param id ID del usuario.
   * @param updatePasswordInput Datos para actualizar la contraseña.
   * @returns El usuario con la contraseña actualizada.
   * @throws NotFoundException si el usuario no existe.
   */
  async updatePassword(
    id: Types.ObjectId,
    updatePasswordInput: UpdatePasswordInput,
  ): Promise<Usuario> {
    const { oldPassword, newPassword } = updatePasswordInput;

    const usuario = await this.usuarioService.findById(id);

    if (usuario.isGoogleAuth) {
      throw new ConflictException(
        'No puedes cambiar la contraseña de un usuario de Google, inicia sesión con tu cuenta de Google',
      );
    }

    // Verificar si la contraseña antigua es correcta
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      usuario.hashPassword,
    );
    if (!isOldPasswordValid) {
      throw new ConflictException('La contraseña antigua es incorrecta');
    }

    // Encriptar la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    usuario.hashPassword = hashedNewPassword;
    await usuario.save();

    return usuario;
  }

  //#region Restablecer contraseña

  /**
   * Inicia el proceso de restablecimiento de contraseña generando un token y enviando un correo.
   * @param email - El correo electrónico del usuario que solicita el restablecimiento.
   * @returns Un mensaje de éxito.
   */
  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.usuarioService.findByEmail(email);
    if (!user) {
      // Buena práctica de seguridad: No revelar si el correo existe
      return 'Si esa dirección de correo existe en nuestro sistema, hemos enviado un enlace para restablecer la contraseña.';
    }

    // Generar un token seguro
    const token = crypto.randomBytes(32).toString('hex');

    // Hashear el token antes de almacenarlo
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Asignar el token y la fecha de expiración (1 hora)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

    try {
      await user.save();
      // Enviar el correo electrónico con el token en texto plano
      await this.mailService.sendPasswordResetEmail(user, token);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al procesar la solicitud de restablecimiento de contraseña.',
        error.message,
      );
    }

    return 'Si esa dirección de correo existe en nuestro sistema, hemos enviado un enlace para restablecer la contraseña.';
  }

  /**
   * Restablece la contraseña del usuario utilizando el token proporcionado.
   * @param token - El token de restablecimiento.
   * @param newPassword - La nueva contraseña.
   * @returns Un mensaje de éxito.
   * @throws BadRequestException si el token es inválido o ha expirado.
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.usuarioService._findOneByResetToken(hashedToken);
    if (!user) {
      throw new BadRequestException(
        'Token de restablecimiento de contraseña inválido o expirado.',
      );
    }

    // Asignar la nueva contraseña (hash)
    user.hashPassword = await bcrypt.hash(newPassword, 10);

    // Limpiar los campos del token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = null;

    try {
      await user.save();
      // Opcional: Enviar un correo de confirmación
      await this.mailService.sendPasswordResetConfirmationEmail(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al restablecer la contraseña.',
        error.message,
      );
    }

    return 'Tu contraseña ha sido restablecida exitosamente.';
  }
}
