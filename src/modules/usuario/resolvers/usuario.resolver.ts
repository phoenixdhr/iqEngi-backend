import { Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';
import { JwtGqlAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-gql-auth.guard';

@Resolver(() => UsuarioOutput)
@UseGuards(JwtGqlAuthGuard) // Aplica el guard a todos los métodos del resolver
export class UsuarioResolver {}
