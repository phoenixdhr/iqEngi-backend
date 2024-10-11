import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { JwtAuthService } from './jwt-auth.service';
import { LoginUserInput } from '../dtos/loginUser.input';
import { UserJwtOutput } from '../entities/user-jwt.output';
import { CreateUsuarioInput } from 'src/modules/usuario/dtos/usuarios-dtos/create-usuario.input';
import { UsuarioOutput } from 'src/modules/usuario/dtos/usuarios-dtos/usuario.output';

import { LocalAuthGuard } from './jwt-auth/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from './jwt-auth/jwt-auth.guard';

@Resolver()
export class JwtAuthResolver {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Mutation(() => UsuarioOutput)
  async signup(
    @Args('createUsuarioInput') createUsuarioInput: CreateUsuarioInput,
  ): Promise<UsuarioOutput> {
    return this.jwtAuthService.signup(createUsuarioInput);
  }

  @Query(() => UserJwtOutput)
  // @UseGuards(LocalAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<UserJwtOutput> {
    console.log('user22222222');

    const user = await this.jwtAuthService.validatePassword(loginUserInput);

    return this.jwtAuthService.login(user);
  }

  @Query(() => String)
  @UseGuards(JwtGqlAuthGuard)
  async tuki(): Promise<string> {
    return 'tuki';
  }
}
