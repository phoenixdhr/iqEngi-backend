import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { JwtAuthService } from './jwt-auth.service';
import { LoginUserInput } from '../dtos/loginUser.input';
import { UserJwtOutput } from '../entities/user-jwt.output';
import { CreateUsuarioInput } from 'src/modules/usuario/dtos/usuarios-dtos/create-usuario.input';
import { UsuarioOutput } from 'src/modules/usuario/dtos/usuarios-dtos/usuario.output';

import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from './jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from '../roles-guards/roles.guard';
import { RolesDec } from '../decorators/roles.decorator';
import { RolEnum } from 'src/common/enums';
import { IsPublic } from '../decorators/public.decorator';
import { MailService } from 'src/modules/mail/mail.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRequest } from '../entities/user-request.entity';

@Resolver()
export class JwtAuthResolver {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Registro de un nuevo usuario.
   * @param createUsuarioInput - Datos de entrada para crear un nuevo usuario.
   * @returns El usuario recién creado.
   */
  @Mutation(() => UsuarioOutput)
  async signup(
    @Args('createUsuarioInput') createUsuarioInput: CreateUsuarioInput,
  ): Promise<UsuarioOutput> {
    return this.jwtAuthService.signup(createUsuarioInput);
  }

  /**
   * Inicio de sesión para un usuario existente.
   * @param loginUserInput - Datos de entrada para autenticar al usuario (email y contraseña).
   * @returns Un objeto con los datos del usuario y el token JWT generado.
   */
  @Query(() => UserJwtOutput)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<UserJwtOutput> {
    const user = await this.jwtAuthService.validatePassword(loginUserInput);
    return this.jwtAuthService.login(user);
  }

  /**
   * Reenvía un correo de verificación si el usuario aún no ha verificado su email.
   * Requiere que el usuario esté autenticado.
   * @param user - Usuario actual obtenido del contexto.
   */
  @Mutation(() => UserJwtOutput)
  @UseGuards(JwtGqlAuthGuard)
  async sendVerificationEmailAgain(@CurrentUser() user: UserRequest) {
    return this.mailService.sendVerificationEmailAgain(user);
  }

  /**
   * ELIMINAME TEST CONSOLE.LOG Consulta de prueba para verificar la protección de rutas.
   * @returns Una cadena de texto si el usuario tiene los permisos adecuados.
   */
  @Query(() => String)
  @UseGuards(JwtGqlAuthGuard, RolesGuard) // Protege la ruta con JWT y validación de roles.
  @RolesDec(RolEnum.ADMINISTRADOR, RolEnum.EDITOR) // Requiere que el usuario tenga roles específicos.
  @IsPublic() // Indica que la ruta es pública y no necesita autenticación (en caso de configurarlo así).
  async tuki(): Promise<string> {
    return 'Acceso autorizado';
  }
}
