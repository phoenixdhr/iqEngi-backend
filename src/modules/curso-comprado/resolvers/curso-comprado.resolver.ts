import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { CursoComprado } from '../entities/curso-comprado.entity';
import { CreateCursoComprado_userInput } from '../dtos/create-curso-comprado-user.input';
import { UpdateCursoCompradoInput } from '../dtos/update-curso-comprado.input';
import { CursoCompradoService } from '../services/curso-comprado.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { CreateCursoCompradoInput } from '../dtos/create-curso-comprado.input';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class CursoCompradoResolver
  implements
    IResolverBase<
      CursoComprado,
      CreateCursoComprado_userInput,
      UpdateCursoCompradoInput
    >
{
  constructor(private readonly cursoCompradoService: CursoCompradoService) {}

  //#region Métodos Generales IBaseResolver

  /**
   * Crea una nueva compra de curso por un usuario.
   *
   * @param createCursoCompradoUserInput Datos necesarios para registrar la compra del curso.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La compra de curso creada.
   */
  @Mutation(() => CursoComprado, { name: 'CursoComprado_create' })
  async create(
    @Args('createCursoCompradoInput')
    createCursoCompradoUserInput: CreateCursoComprado_userInput,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoComprado> {
    const userId = new Types.ObjectId(user._id);
    const createCursoCompradoInput = {
      ...createCursoCompradoUserInput,
      usuarioId: userId,
    } as CreateCursoCompradoInput;
    return (
      await (
        await this.cursoCompradoService.create(createCursoCompradoInput, userId)
      ).populate('cursoId')
    ).populate('usuarioId');
  }

  /**
   * Obtiene todas las compras de cursos con opciones de paginación.
   *
   * @param pagination Opcional. Parámetros de paginación.
   * @returns Un arreglo con las compras de cursos encontradas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [CursoComprado], { name: 'CursoComprados' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<CursoComprado[]> {
    return this.cursoCompradoService.findAll(pagination);
  }

  /**
   * Obtiene una compra de curso específica por su ID.
   *
   * @param id ID único de la compra de curso.
   * @returns La compra de curso encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => CursoComprado, { name: 'CursoComprado' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<CursoComprado> {
    return this.cursoCompradoService.findById(id);
  }

  // LA FUNCION UPDATE NO ES NECESARIA Y PUEDE SER ELIMINADA
  // /**
  //  * Actualiza una compra de curso existente por su ID.
  //  * NOTA: Este método no es necesario según la lógica actual de la aplicación y puede eliminarse.
  //  *
  //  * @param id ID de la compra de curso a actualizar.
  //  * @param updateCursoCompradoInput Datos para actualizar la compra de curso.
  //  * @param user Usuario autenticado que realiza la operación.
  //  * @returns La compra de curso actualizada.
  //  */
  // @Mutation(() => CursoComprado, { name: 'CursoComprado_update' })
  // async update(
  //   @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  //   @Args('updateCursoCompradoInput')
  //   updateCursoCompradoInput: UpdateCursoCompradoInput,
  //   @CurrentUser() user: UserRequest,
  // ): Promise<CursoComprado> {
  //   const idUpdatedBy = new Types.ObjectId(user._id);
  //   return this.cursoCompradoService.update(
  //     id,
  //     updateCursoCompradoInput,
  //     idUpdatedBy,
  //   );
  // }

  /**
   * Elimina lógicamente una compra de curso por su ID (soft delete).
   *
   * @param idRemove ID de la compra de curso a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La compra de curso eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoComprado, { name: 'CursoComprado_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoComprado> {
    const idThanos = new Types.ObjectId(user._id);
    return this.cursoCompradoService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente una compra de curso por su ID (hard delete).
   *
   * Este método solo está disponible para usuarios con rol SUPERADMIN.
   *
   * @param id ID de la compra de curso a eliminar permanentemente.
   * @returns La compra de curso eliminada definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => CursoComprado, { name: 'CursoComprado_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<CursoComprado> {
    return this.cursoCompradoService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las compras de cursos que han sido eliminadas lógicamente.
   *
   * Este método solo está disponible para usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de compras eliminadas permanentemente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'CursoComprado_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.cursoCompradoService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todas las compras de cursos que han sido eliminadas lógicamente.
   *
   * @param pagination Opcional. Parámetros de paginación.
   * @returns Un arreglo con las compras de cursos eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [CursoComprado], { name: 'CursoComprado_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<CursoComprado[]> {
    return this.cursoCompradoService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una compra de curso que ha sido eliminada lógicamente.
   *
   * @param idRestore ID de la compra de curso a restaurar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns La compra de curso restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoComprado, { name: 'CursoComprado_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoComprado> {
    const userId = new Types.ObjectId(user._id);
    return this.cursoCompradoService.restore(idRestore, userId);
  }

  //#region Consultas personalizadas

  /**
   * Obtiene todas las compras de cursos asociadas a un curso específico.
   *
   * @param cursoId ID del curso.
   * @returns Un arreglo con las compras de cursos asociadas al curso.
   *
   * @Roles: No requiere roles específicos.
   */
  @Query(() => [CursoComprado], { name: 'CursoCompradoes_PorCurso' })
  async findByCurso(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
  ): Promise<CursoComprado[]> {
    return this.cursoCompradoService.findByCursoId(cursoId);
  }

  /**
   * Obtiene todas las compras de cursos realizadas por un usuario específico.
   *
   * @param usuarioId ID del usuario.
   * @returns Un arreglo con las compras de cursos realizadas por el usuario.
   *
   * @Roles: No requiere roles específicos.
   */
  @Query(() => [CursoComprado], { name: 'CursoCompradoes_PorUsuario' })
  async findByUsuario(
    @Args('usuarioId', { type: () => ID }, IdPipe) usuarioId: Types.ObjectId,
  ): Promise<CursoComprado[]> {
    return this.cursoCompradoService.findByUsuarioId(usuarioId);
  }
}
