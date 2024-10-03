import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsuarioType } from '../entities/usuario.entity';
import { RolesEnumGql } from 'src/usuario/dtos/args-gql/rolesEnumGql';
import { UserRequest } from 'src/auth/entities/type-gql/user_jwt.entity';
import { JwtGqlAuthGuard } from 'src/auth/guards/jwt-auth/jwt-gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UsuarioService } from '../services/usuario.service';
import { RolEnum } from 'src/auth/enums/roles.model';
import { UpdateUsuarioInput } from '../dtos/input-gql/usuario.input';
import { SEED_USUARIO } from 'src/seed/data/seed-data';
import { SearchArgs, PaginationArgs } from 'src/_common/dtos';
// import { UpdateUsuarioDto } from '../dtos/usuario.dto';

@Resolver(() => UsuarioType)
@UseGuards(JwtGqlAuthGuard) // Aplica el guard a todos los métodos del resolver
export class UsuarioResolver {
  private readonly logger = new Logger(UsuarioResolver.name);

  constructor(private readonly usuariosService: UsuarioService) {}

  @Query(() => [UsuarioType], {
    name: 'usuarios',
    description:
      'Obtiene una lista de usuarios, opcionalmente filtrados por roles.',
  })
  async findAll(
    @CurrentUser([RolEnum.ADMINISTRADOR]) user: UserRequest,
    @Args('roles', {
      type: () => RolesEnumGql,
      nullable: true,
      description: 'Filtrar usuarios por roles específicos.',
    })
    roles?: RolesEnumGql,
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
    @Args({ type: () => SearchArgs, nullable: true })
    search?: SearchArgs,
  ): Promise<UsuarioType[]> {
    console.log('pagination ===> ', pagination);
    console.log('search ===> ', search);
    // this.logger.debug(`roles ===> ${JSON.stringify(roles)}`); // Uso del Logger en lugar de console.log
    if (!roles || !roles.roles) {
      return this.usuariosService.findAll(pagination, search);
    }
    return this.usuariosService.findUsersByRol(roles);
  }

  @Query(() => UsuarioType, {
    name: 'usuario',
    description: 'Obtiene un usuario por su id.',
  })
  async findOne(
    @CurrentUser([RolEnum.ADMINISTRADOR]) user: UserRequest,
    @Args('id', { type: () => ID, description: 'Id del usuario a obtener.' })
    id: string,
  ): Promise<UsuarioType> {
    console.log('USUARIO ===>>', SEED_USUARIO);
    return this.usuariosService.findOne(id);
  }

  @Mutation(() => UsuarioType, { name: 'updateUser' })
  async updateUser(
    @CurrentUser([RolEnum.ADMINISTRADOR]) user: UserRequest,
    @Args('id', { type: () => ID }) id: string,
    @Args('data', { type: () => UpdateUsuarioInput, nullable: true })
    data?: UpdateUsuarioInput,
  ): Promise<UsuarioType> {
    console.log('data ===> mama mia');
    return this.usuariosService.update(id, data);
  }
}
