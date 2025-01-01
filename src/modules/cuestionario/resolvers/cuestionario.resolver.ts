import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cuestionario } from '../entities/cuestionario.entity';
import { UpdateCuestionarioInput } from '../dtos/cuestionario-dtos/update-cuestionario.input';
import { CreateCuestionarioInput } from '../dtos/cuestionario-dtos/create-cuestionario.input';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { CuestionarioService } from '../services/cuestionario.service';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class CuestionarioResolver
  implements
    IResolverBase<
      Cuestionario,
      UpdateCuestionarioInput,
      CreateCuestionarioInput
    >
    
{
  constructor(private readonly cuestionarioService: CuestionarioService) {}

  /**
   * Crea un nuevo cuestionario y lo asocia a un curso específico.
   *
   * @param createCuestionarioInput Datos necesarios para crear el cuestionario.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El cuestionario creado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Cuestionario, { name: 'Cuestionario_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createCuestionarioInput')
    createCuestionarioInput: CreateCuestionarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Cuestionario> {
    const userId = new Types.ObjectId(user._id);
    return this.cuestionarioService.create(createCuestionarioInput, userId);
  }

  /**
   * Obtiene todos los cuestionarios, con soporte opcional para paginación.
   *
   * @param pagination Opciones de paginación (opcional).
   * @returns Una lista de cuestionarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Cuestionario], { name: 'Cuestionarios' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Cuestionario[]> {
    //return this.cuestionarioService.findAll(pagination);
    const cuestionarios = await this.cuestionarioService.findAll(pagination);
    // Verifica que los datos lleguen correctamente
    console.log('Cuestionarios encontradosxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:', cuestionarios);
    return cuestionarios;
  }



  /**
   * Obtiene un cuestionario por su ID único.
   *
   * @param id ID del cuestionario a buscar.
   * @returns El cuestionario encontrado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Cuestionario, { name: 'Cuestionario' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Cuestionario> {
    return this.cuestionarioService.findById(id);
  }

  /**
   * Actualiza los datos de un cuestionario existente.
   *
   * @param id ID del cuestionario a actualizar.
   * @param updateCuestionarioInput Datos actualizados del cuestionario.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns El cuestionario actualizado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Cuestionario, { name: 'Cuestionario_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateCuestionarioInput')
    updateCuestionarioInput: UpdateCuestionarioInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Cuestionario> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.cuestionarioService.update(
      id,
      updateCuestionarioInput,
      idUpdatedBy,
    );
  }

  /**
   * Realiza una eliminación lógica de un cuestionario, marcándolo como eliminado.
   *
   * @param idRemove ID del cuestionario a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns El cuestionario eliminado lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Cuestionario, { name: 'Cuestionario_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Cuestionario> {
    const idThanos = new Types.ObjectId(user._id);
    return this.cuestionarioService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente un cuestionario por su ID.
   *
   * Este método solo está disponible para usuarios con el rol SUPERADMIN.
   *
   * @param id ID del cuestionario a eliminar definitivamente.
   * @returns El cuestionario eliminado de forma permanente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => Cuestionario, { name: 'Cuestionario_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Cuestionario> {
    return this.cuestionarioService.hardDelete(id);
  }

  /**
   * Elimina de forma permanente todos los cuestionarios marcados como eliminados lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con el rol SUPERADMIN.
   *
   * @returns Un objeto con el conteo de los cuestionarios eliminados.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Cuestionario_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.cuestionarioService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene una lista de cuestionarios eliminados lógicamente.
   *
   * @param pagination Opciones de paginación (opcional).
   * @returns Una lista de cuestionarios marcados como eliminados.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Cuestionario], {
    name: 'Cuestionario_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Cuestionario[]> {
    return this.cuestionarioService.findSoftDeleted(pagination);
  }

  /**
   * Restaura un cuestionario previamente eliminado lógicamente.
   *
   * @param idRestore ID del cuestionario a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns El cuestionario restaurado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Cuestionario, { name: 'Cuestionario_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Cuestionario> {
    const userId = new Types.ObjectId(user._id);
    return this.cuestionarioService.restore(idRestore, userId);
  }
}
