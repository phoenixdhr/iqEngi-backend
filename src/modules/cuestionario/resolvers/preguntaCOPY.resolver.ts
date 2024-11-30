import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IBaseResolver } from 'src/common/interfaces/base-resolver.interface';
import { Pregunta } from '../entities/pregunta.entity';
import { UpdatePreguntaInput } from '../dtos/pregunta-dtos/update-pregunta.input';
import { CreatePreguntaInput } from '../dtos/pregunta-dtos/create-pregunta.input';
import { PreguntaService } from '../services/pregunta.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { PreguntaServiceCopy } from '../services/preguntaCOPY.service';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
// implements IBaseResolver<Pregunta, UpdatePreguntaInput, CreatePreguntaInput>
export class PreguntaResolverCopy {
  constructor(private readonly preguntaServiceCopy: PreguntaServiceCopy) {}

  //#region create
  /**
   * Crea una nueva pregunta.
   *
   * @param createPreguntaInput - Datos necesarios para crear la pregunta.
   * @param user - Usuario autenticado que realiza la creación.
   * @returns La pregunta creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Pregunta, { name: 'createPregunta_____COPYInput' })
  @RolesDec(...administradorUp)
  async create(
    @Args('docId', { type: () => ID }, IdPipe) docId: Types.ObjectId,
    @Args('createPreguntaInput') createPreguntaInput: CreatePreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const userId = new Types.ObjectId(user._id);
    return this.preguntaServiceCopy.create(docId, createPreguntaInput, userId);
  }
  //#endregion

  // //#region find
  // /**
  //  * Obtiene todas las preguntas con opciones de paginación.
  //  *
  //  * @param pagination - Opcional. Opciones de paginación.
  //  * @returns Un array de preguntas.
  //  *
  //  * @Roles: ADMINISTRADOR, SUPERADMIN
  //  */
  // @Query(() => [Pregunta], { name: 'Preguntas' })
  // @RolesDec(...administradorUp)
  // async findAll(@Args() pagination?: PaginationArgs): Promise<Pregunta[]> {
  //   return this.preguntaService.findAll(pagination);
  // }

  // /**
  //  * Obtiene una pregunta específica por su ID.
  //  *
  //  * @param id - ID único de la pregunta.
  //  * @returns La pregunta encontrada.
  //  *
  //  * @Roles: ADMINISTRADOR, SUPERADMIN
  //  */
  // @Query(() => Pregunta, { name: 'Pregunta' })
  // @RolesDec(...administradorUp)
  // async findById(
  //   @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  // ): Promise<Pregunta> {
  //   return this.preguntaService.findById(id);
  // }
  // //#endregion

  // //#region update
  // /**
  //  * Actualiza una pregunta existente por su ID.
  //  *
  //  * @param id - ID de la pregunta a actualizar.
  //  * @param updatePreguntaInput - Datos para actualizar la pregunta.
  //  * @param user - Usuario autenticado que realiza la actualización.
  //  * @returns La pregunta actualizada.
  //  *
  //  * @Roles: ADMINISTRADOR, SUPERADMIN
  //  */
  // @Mutation(() => Pregunta, { name: 'Pregunta_update' })
  // @RolesDec(...administradorUp)
  // async update(
  //   @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  //   @Args('updatePreguntaInput') updatePreguntaInput: UpdatePreguntaInput,
  //   @CurrentUser() user: UserRequest,
  // ): Promise<Pregunta> {
  //   const idUpdatedBy = new Types.ObjectId(user._id);
  //   return this.preguntaService.update(id, updatePreguntaInput, idUpdatedBy);
  // }
  // //#endregion

  // //#region delete
  // /**
  //  * Elimina lógicamente una pregunta por su ID.
  //  *
  //  * @param idRemove - ID de la pregunta a eliminar.
  //  * @param user - Usuario autenticado que realiza la eliminación.
  //  * @returns La pregunta eliminada lógicamente.
  //  *
  //  * @Roles: ADMINISTRADOR, SUPERADMIN
  //  */
  // @Mutation(() => Pregunta, { name: 'Pregunta_softDelete' })
  // @RolesDec(...administradorUp)
  // async softDelete(
  //   @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
  //   @CurrentUser() user: UserRequest,
  // ): Promise<Pregunta> {
  //   const idThanos = new Types.ObjectId(user._id);
  //   return this.preguntaService.softDelete(idRemove, idThanos);
  // }

  // /**
  //  * Elimina permanentemente una pregunta por su ID.
  //  *
  //  * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
  //  *
  //  * @param id - ID de la pregunta a eliminar permanentemente.
  //  * @returns La pregunta eliminada definitivamente.
  //  *
  //  * @Roles: SUPERADMIN
  //  */
  // @Mutation(() => Pregunta, { name: 'Pregunta_hardDelete' })
  // @RolesDec(RolEnum.SUPERADMIN)
  // async hardDelete(
  //   @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  // ): Promise<Pregunta> {
  //   return this.preguntaService.hardDelete(id);
  // }

  // /**
  //  * Elimina permanentemente todas las preguntas que han sido eliminadas lógicamente.
  //  *
  //  * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
  //  *
  //  * @returns Un objeto que contiene el conteo de preguntas eliminadas.
  //  *
  //  * @Roles: SUPERADMIN
  //  */
  // @Mutation(() => DeletedCountOutput, {
  //   name: 'Pregunta_hardDeleteAllSoftDeleted',
  // })
  // @RolesDec(RolEnum.SUPERADMIN)
  // async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
  //   return this.preguntaService.hardDeleteAllSoftDeleted();
  // }
  // //#endregion

  // //#region restore
  // /**
  //  * Obtiene todas las preguntas que han sido eliminadas lógicamente.
  //  *
  //  * @param pagination - Opcional. Opciones de paginación.
  //  * @returns Un array de preguntas eliminadas lógicamente.
  //  *
  //  * @Roles: ADMINISTRADOR, SUPERADMIN
  //  */
  // @Query(() => [Pregunta], {
  //   name: 'Pregunta_findSoftDeleted',
  // })
  // @RolesDec(...administradorUp)
  // async findSoftDeleted(
  //   @Args({ type: () => PaginationArgs, nullable: true })
  //   pagination?: PaginationArgs,
  // ): Promise<Pregunta[]> {
  //   return this.preguntaService.findSoftDeleted(pagination);
  // }

  // /**
  //  * Restaura una pregunta que ha sido eliminada lógicamente.
  //  *
  //  * @param idRestore - ID de la pregunta a restaurar.
  //  * @param user - Usuario autenticado que realiza la restauración.
  //  * @returns La pregunta restaurada.
  //  *
  //  * @Roles: ADMINISTRADOR, SUPERADMIN
  //  */
  // @Mutation(() => Pregunta, { name: 'Pregunta_restore' })
  // @RolesDec(...administradorUp)
  // async restore(
  //   @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
  //   @CurrentUser() user: UserRequest,
  // ): Promise<Pregunta> {
  //   const userId = new Types.ObjectId(user._id);
  //   return this.preguntaService.restore(idRestore, userId);
  // }
  // //#endregion
}
