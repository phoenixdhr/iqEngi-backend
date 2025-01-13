import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Orden } from '../entities/orden.entity';

import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { OrdenArrayCursoService } from '../services/ordenArrayCursoItem.service';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class OrdenArrayCursoResolver {
  constructor(
    private readonly ordenArrayCursoService: OrdenArrayCursoService,
  ) {}

  /**
   * Crea una nueva categoría.
   *
   * @param createOrden_ListCursosInput Datos necesarios para crear la categoría.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La categoría creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_pushCurso' })
  async pushToArray(
    @Args({ name: 'ordenId', type: () => ID })
    ordenId: Types.ObjectId,
    @Args({ name: 'arrayCursosIds', type: () => [ID] })
    createOrden_ListCursosInput: Types.ObjectId[],
    @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    console.log('Input recibido:', createOrden_ListCursosInput); // Verificación temporal
    const userId = new Types.ObjectId(new Types.ObjectId(user._id));
    return this.ordenArrayCursoService._pushToArray(
      ordenId,
      userId,
      createOrden_ListCursosInput,
    );
  }

  /**
   * Elimina permanentemente una categoría por su ID.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id ID de la categoría a eliminar permanentemente.
   * @returns La categoría eliminada definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Orden, { name: 'Ordenes_pullCurso' })
  async pullArray(
    @Args({ name: 'ordenId', type: () => ID })
    ordenId: Types.ObjectId,
    @Args('arrayCursosIds', { type: () => [ID] })
    cursoId: Types.ObjectId[],
    // @CurrentUser() user: UserRequest,
  ): Promise<Orden> {
    // const userId = new Types.ObjectId(new Types.ObjectId(user._id));
    console.log('0000000000000000000000000000000'); // Verificación temporal
    return this.ordenArrayCursoService._pullFromArray(ordenId, cursoId);
  }
}
