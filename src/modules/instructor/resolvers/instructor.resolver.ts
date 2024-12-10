import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { PaginationArgs, SearchTextArgs } from 'src/common/dtos';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { Types } from 'mongoose';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';

import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';
import { Instructor } from '../entities/instructor.entity';
import { UpdateInstructorInput } from '../dtos/update-instructor.input';
import { InstructorService } from '../services/instructor.service';
import { CreateInstructorInput } from '../dtos/create-instructor.input';

@UseGuards(JwtGqlAuthGuard, RolesGuard)
@Resolver(() => Instructor)
export class InstructorResolver
  implements
    IResolverBase<Instructor, CreateInstructorInput, UpdateInstructorInput>
{
  constructor(private readonly instructorService: InstructorService) {}

  /**
   * Crea una nueva categoría.
   *
   * @param createInstructorInput Datos necesarios para crear la categoría.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La categoría creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Instructor, { name: 'Instructor_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createInstructorInput') createInstructorInput: CreateInstructorInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Instructor> {
    const userId = new Types.ObjectId(new Types.ObjectId(user._id));
    return this.instructorService.create(createInstructorInput, userId);
  }

  /**
   * Obtiene todas las categorías con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Instructor], { name: 'Instructores' })
  @RolesDec(...administradorUp)
  async findAll(@Args() pagination?: PaginationArgs): Promise<Instructor[]> {
    return this.instructorService.findAll(pagination);
  }

  /**
   * Obtiene todas las categorías con opciones de paginación y búsqueda.
   *
   * @param searchArgs Objeto que contiene un campo "search" (texto que se usará para realizar búsquedas).
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Instructor], { name: 'Instructor_findAllByNombre' })
  @RolesDec(...administradorUp)
  async findAllByNombre(
    @Args() searchArgs: SearchTextArgs,
    @Args() pagination?: PaginationArgs,
  ): Promise<Instructor[]> {
    return this.instructorService.findAllByNombre(searchArgs, pagination);
  }

  /**
   * Obtiene una categoría específica por su ID.
   *
   * @param id ID único de la categoría.
   * @returns La categoría encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => Instructor, { name: 'Instructor' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Instructor> {
    return this.instructorService.findById(id);
  }

  /**
   * Actualiza una categoría existente por su ID.
   *
   * @param id ID de la categoría a actualizar.
   * @param updateInstructorInput Datos para actualizar la categoría.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns La categoría actualizada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Instructor, { name: 'Instructor_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateInstructorInput') updateInstructorInput: UpdateInstructorInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Instructor> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.instructorService.update(
      id,
      updateInstructorInput,
      idUpdatedBy,
    );
  }

  /**
   * Elimina lógicamente una categoría por su ID.
   *
   * @param idRemove ID de la categoría a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns La categoría eliminada lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Instructor, { name: 'Instructor_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Instructor> {
    const idThanos = new Types.ObjectId(user._id);
    return this.instructorService.softDelete(idRemove, idThanos);
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
  @Mutation(() => Instructor, { name: 'Instructor_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<Instructor> {
    return this.instructorService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todas las categorías que han sido eliminadas lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de categorías eliminadas.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Instructor_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.instructorService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todas las categorías que han sido eliminadas lógicamente.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de categorías eliminadas lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [Instructor], {
    name: 'Instructor_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Instructor[]> {
    return this.instructorService.findSoftDeleted(pagination);
  }

  /**
   * Restaura una categoría que ha sido eliminada lógicamente.
   *
   * @param idRestore ID de la categoría a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns La categoría restaurada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => Instructor, { name: 'Instructor_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Instructor> {
    const userId = new Types.ObjectId(user._id);
    return this.instructorService.restore(idRestore, userId);
  }
}
