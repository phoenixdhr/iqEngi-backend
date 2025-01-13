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
@UseGuards(JwtGqlAuthGuard, RolesGuard) // Aplica autenticación y verificación de roles para todos los métodos del resolver.
export class OrdenArrayCursoResolver {
  constructor(
    private readonly ordenArrayCursoService: OrdenArrayCursoService, // Servicio que gestiona las operaciones sobre el array de cursos en una orden.
  ) {}

  /**
   * Agrega uno o más cursos a una orden existente.
   *
   * Este método permite agregar una lista de cursos a una orden. Antes de realizar la operación,
   * verifica que los cursos no estén duplicados en la orden y que no hayan sido eliminados en la base de datos.
   * También recalcula el monto total de la orden después de agregar los cursos.
   *
   * @param ordenId ID de la orden a la que se agregarán los cursos.
   * @param createOrden_ListCursosInput Lista de IDs de los cursos a agregar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La orden actualizada con los cursos añadidos.
   */
  @Mutation(() => Orden, { name: 'Ordenes_pushCurso' })
  async pushToArray(
    @Args({ name: 'ordenId', type: () => ID }) ordenId: Types.ObjectId, // ID de la orden.
    @Args({ name: 'arrayCursosIds', type: () => [ID] })
    createOrden_ListCursosInput: Types.ObjectId[], // Lista de IDs de los cursos a agregar.
    @CurrentUser() user: UserRequest, // Información del usuario autenticado.
  ): Promise<Orden> {
    const userId = new Types.ObjectId(user._id); // Convertir el ID del usuario a ObjectId para usar en MongoDB.
    return this.ordenArrayCursoService.pushToArray(
      ordenId,
      userId,
      createOrden_ListCursosInput,
    ); // Llamada al servicio para agregar cursos a la orden.
  }

  /**
   * Elimina uno o más cursos de una orden existente.
   *
   * Este método permite eliminar una lista de cursos de una orden. Después de la eliminación,
   * recalcula el monto total de la orden basada en los cursos restantes.
   *
   * @param ordenId ID de la orden de la que se eliminarán los cursos.
   * @param cursoId Lista de IDs de los cursos a eliminar.
   * @returns La orden actualizada después de la eliminación de los cursos.
   */
  @Mutation(() => Orden, { name: 'Ordenes_pullCurso' })
  async pullFromArray(
    @Args({ name: 'ordenId', type: () => ID }) ordenId: Types.ObjectId, // ID de la orden.
    @Args('arrayCursosIds', { type: () => [ID] })
    cursoId: Types.ObjectId[], // Lista de IDs de los cursos a eliminar.
  ): Promise<Orden> {
    return this.ordenArrayCursoService.pullFromArray(ordenId, cursoId); // Llamada al servicio para eliminar cursos de la orden.
  }
}
