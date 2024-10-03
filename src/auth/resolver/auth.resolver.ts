import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUsuarioInput,
  UserPasswordInput,
} from 'src/usuario/dtos/input-gql/usuario.input';
import { UsuarioType } from 'src/usuario/entities/usuario.entity';
import { AuthService } from '../services/auth.service';
import { userAndJWT, UserRequest } from '../entities/type-gql/user_jwt.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from '../guards/jwt-auth/jwt-gql-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RolEnum } from '../enums/roles.model';
import { UsuarioService } from 'src/usuario/services/usuario.service';
import { RolesEnumGql } from '../../usuario/dtos/args-gql/rolesEnumGql';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuarioService,
  ) {}

  @Mutation(() => UsuarioType)
  async signup(
    @Args('CreateUsuario') createUsuario: CreateUsuarioInput,
  ): Promise<UsuarioType> {
    const newUser = await this.authService.signup(createUsuario);
    return newUser;
  }

  @Query(() => userAndJWT)
  async login(
    @Args('uses_password') uses_password: UserPasswordInput,
  ): Promise<userAndJWT> {
    const user = await this.authService.validatePassword(uses_password);
    const user_jwt = await this.authService.generateJWT(user);

    return user_jwt;
  }

  @Query(() => userAndJWT)
  @UseGuards(JwtGqlAuthGuard)
  async revalidateToken(
    @CurrentUser([RolEnum.ESTUDIANTE]) user: UserRequest,
  ): Promise<userAndJWT> {
    return this.authService.revalidateToken(user);
  }
}
