import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Curso } from '../entities/curso.entity';
import { UpdateCursoInput } from '../dtos/curso-dtos/update-curso.input';
import { CreateCursoInput } from '../dtos/curso-dtos/create-curso.input';
import { CursoService } from '../services/curso.service';
import { administradorUp, RolEnum } from 'src/common/enums/rol.enum';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { PaginationArgs, SearchTextArgs } from 'src/common/dtos';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { DeletedCountOutput } from 'src/modules/usuario/dtos/usuarios-dtos/deleted-count.output';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { Types } from 'mongoose';
import { IResolverBase } from 'src/common/interfaces/resolver-base.interface';
import { CursoOutput } from '../dtos/curso-dtos/curso.output';
import { IsPublic } from 'src/modules/auth/decorators/public.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CursoComprado } from 'src/modules/curso-comprado/entities/curso-comprado.entity';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class CursoResolver
  implements IResolverBase<Curso, UpdateCursoInput, CreateCursoInput> {
  constructor(
    private readonly cursoService: CursoService,
    @InjectModel(CursoComprado.name)
    private readonly cursoCompradoModel: Model<CursoComprado>,
  ) { }

  /**
   * Crea un nuevo curso.
   *
   * @param createCursoInput Datos necesarios para crear el curso.
   * @param user Usuario autenticado que realiza la creación.
   * @returns El curso creado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('createCursoInput') createCursoInput: CreateCursoInput,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoOutput> {
    const userId = new Types.ObjectId(user._id);
    return this.cursoService.create(createCursoInput, userId);
  }

  /**
   * Obtiene todos los cursos con opciones de paginación.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de cursos.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [CursoOutput], { name: 'Cursos' })
  // @RolesDec(...administradorUp)
  @IsPublic()
  async findAll(@Args() pagination?: PaginationArgs): Promise<CursoOutput[]> {
    const cursos = await this.cursoService.findAll(pagination);
    return cursos.map((curso) => {
      curso.modulosIds = [];
      return curso;
    });
  }

  /**
   * Obtiene todos los Cursos con opciones de paginación y búsqueda.
   * @param searchArgs Objeto que contiene un campo "serch" (texto que se usara para realizar busquedas).
   * @param pagination Opciones de paginación.
   * @returns Un array de Cursos.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [CursoOutput], { name: 'Curso_findAllByTitle' })
  @RolesDec(...administradorUp)
  async findAllByTitle(
    @Args() searchArgs: SearchTextArgs,
    @Args() pagination?: PaginationArgs,
  ): Promise<CursoOutput[]> {
    const cursos = await this.cursoService.findAllByTitle(searchArgs, pagination);
    return cursos.map((curso) => {
      curso.modulosIds = [];
      return curso;
    });
  }

  /**
   * Obtiene un curso específico por su ID.
   *
   * @param id ID único del curso.
   * @returns El curso encontrado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => CursoOutput, { name: 'Curso' })
  @IsPublic()
  async findById(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @CurrentUser() user?: UserRequest,
  ): Promise<CursoOutput> {
    const curso = await this.cursoService.findById(id);

    // Si es administrador o superadmin, tiene acceso total
    if (user && user.roles.some((role) => administradorUp.includes(role))) {
      return curso;
    }

    let hasAccess = false;

    if (user) {
      const isComprado = await this.cursoCompradoModel.exists({
        usuarioId: new Types.ObjectId(user._id),
        cursoId: id,
        deleted: false,
      });

      if (isComprado) hasAccess = true;
    }

    if (!hasAccess) {
      curso.modulosIds = [];
      // Aquí se pueden ocultar otros campos si es necesario
    }

    return curso;
  }

  /**
   * Actualiza un curso existente por su ID.
   *
   * @param id ID del curso a actualizar.
   * @param updateCursoInput Datos para actualizar el curso.
   * @param user Usuario autenticado que realiza la actualización.
   * @returns El curso actualizado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
    @Args('updateCursoInput') updateCursoInput: UpdateCursoInput,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoOutput> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.cursoService.update(id, updateCursoInput, idUpdatedBy);
  }

  /**
   * Elimina lógicamente un curso por su ID.
   *
   * @param idRemove ID del curso a eliminar.
   * @param user Usuario autenticado que realiza la eliminación.
   * @returns El curso eliminado lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idRemove', { type: () => ID }, IdPipe) idRemove: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoOutput> {
    const idThanos = new Types.ObjectId(user._id);
    return this.cursoService.softDelete(idRemove, idThanos);
  }

  /**
   * Elimina permanentemente un curso por su ID.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @param id ID del curso a eliminar permanentemente.
   * @returns El curso eliminado definitivamente.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('id', { type: () => ID }, IdPipe) id: Types.ObjectId,
  ): Promise<CursoOutput> {
    return this.cursoService.hardDelete(id);
  }

  /**
   * Elimina permanentemente todos los cursos que han sido eliminados lógicamente.
   *
   * Este método solo puede ser ejecutado por usuarios con rol SUPERADMIN.
   *
   * @returns Un objeto que contiene el conteo de cursos eliminados.
   *
   * @Roles: SUPERADMIN
   */
  @Mutation(() => DeletedCountOutput, {
    name: 'Curso_hardDeleteAllSoftDeleted',
  })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(): Promise<DeletedCountOutput> {
    return this.cursoService.hardDeleteAllSoftDeleted();
  }

  /**
   * Obtiene todos los cursos que han sido eliminados lógicamente.
   *
   * @param pagination Opcional. Opciones de paginación.
   * @returns Un array de cursos eliminados lógicamente.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [CursoOutput], {
    name: 'Curso_findSoftDeleted',
  })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<CursoOutput[]> {
    return this.cursoService.findSoftDeleted(pagination);
  }

  /**
   * Restaura un curso que ha sido eliminado lógicamente.
   *
   * @param idRestore ID del curso a restaurar.
   * @param user Usuario autenticado que realiza la restauración.
   * @returns El curso restaurado.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idRestore', { type: () => ID }, IdPipe) idRestore: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<CursoOutput> {
    const userId = new Types.ObjectId(user._id);
    return this.cursoService.restore(idRestore, userId);
  }

  /**
   * Agrega una o más categorías a un curso existente.
   *
   * @param cursoId ID del curso al que se agregarán las categorías.
   * @param categoriaIds Array de IDs de categorías a agregar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El curso actualizado con las categorías populadas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_addCategorias' })
  @RolesDec(...administradorUp)
  async addCategorias(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
    @Args('categoriaIds', { type: () => [ID] }) categoriaIds: string[],
    @CurrentUser() user: UserRequest,
  ): Promise<CursoOutput> {
    const userId = new Types.ObjectId(user._id);
    const categoriaObjectIds = categoriaIds.map((id) => new Types.ObjectId(id));
    return this.cursoService.addCategorias(cursoId, categoriaObjectIds, userId);
  }

  /**
   * Elimina una o más categorías de un curso existente.
   *
   * @param cursoId ID del curso del que se eliminarán las categorías.
   * @param categoriaIds Array de IDs de categorías a eliminar.
   * @param user Usuario autenticado que realiza la operación.
   * @returns El curso actualizado con las categorías populadas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => CursoOutput, { name: 'Curso_removeCategorias' })
  @RolesDec(...administradorUp)
  async removeCategorias(
    @Args('cursoId', { type: () => ID }, IdPipe) cursoId: Types.ObjectId,
    @Args('categoriaIds', { type: () => [ID] }) categoriaIds: string[],
    @CurrentUser() user: UserRequest,
  ): Promise<CursoOutput> {
    const userId = new Types.ObjectId(user._id);
    const categoriaObjectIds = categoriaIds.map((id) => new Types.ObjectId(id));
    return this.cursoService.removeCategorias(cursoId, categoriaObjectIds, userId);
  }
}

