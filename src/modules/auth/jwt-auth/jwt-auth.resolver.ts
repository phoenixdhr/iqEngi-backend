import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { JwtAuthService } from './jwt-auth.service';
import { LoginUserInput } from '../dtos/loginUser.input';
import { UserJwtOutput } from '../entities/user-jwt.output';
import { CreateUsuarioInput } from 'src/modules/usuario/dtos/usuarios-dtos/create-usuario.input';
import { UsuarioOutput } from 'src/modules/usuario/dtos/usuarios-dtos/usuario.output';
import { Response } from 'express';

import { Inject, UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from './jwt-auth.guard/jwt-auth.guard';

import { IsPublic } from '../decorators/public.decorator';
import { MailService } from 'src/modules/mail/mail.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRequest } from '../entities/user-request.entity';
import configEnv from 'src/common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Resolver()
export class JwtAuthResolver {
  constructor(
    private readonly jwtAuthService: JwtAuthService, // Servicio de autenticación JWT
    private readonly mailService: MailService, // Servicio de envío de correos
    private readonly authService: AuthService, // Servicio de autenticación
    @Inject(configEnv.KEY) readonly configService: ConfigType<typeof configEnv>, // Configuración de variables de entorno
  ) {}

  /**
   * Registro de un nuevo usuario.
   * Crea un usuario con los datos proporcionados.
   * @param createUsuarioInput - Datos para la creación del usuario.
   * @returns El usuario creado.
   */
  @Mutation(() => UsuarioOutput)
  async signup(
    @Args('createUsuarioInput') createUsuarioInput: CreateUsuarioInput,
  ): Promise<UsuarioOutput> {
    return this.jwtAuthService.signup(createUsuarioInput);
  }

  /**
   * Inicia sesión de un usuario y genera un token JWT.
   * @param loginUserInput - Datos de inicio de sesión del usuario (email y contraseña).
   * @param context - Contexto de GraphQL con acceso a la respuesta HTTP.
   * @returns Los datos del usuario autenticado.
   * @throws UnauthorizedException - Si las credenciales no son válidas.
   * @throws InternalServerErrorException - Si ocurre un error durante el proceso.
   */
  @Mutation(() => UserRequest)
  @IsPublic() // Permite el acceso sin autenticación previa
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context: { res: Response },
  ): Promise<UserRequest> {
    return await this.jwtAuthService.login(loginUserInput, context.res);
  }

  /**
   * Envía un correo de verificación al usuario.
   * Solo se permite a usuarios autenticados.
   * @param user - Datos del usuario actual.
   * @returns El resultado del envío de correo.
   */
  @Mutation(() => UserJwtOutput)
  @UseGuards(JwtGqlAuthGuard) // Requiere autenticación JWT
  async sendVerificationEmailAgain(@CurrentUser() user: UserRequest) {
    return this.mailService.sendVerificationEmailAgain(user);
  }
}
