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
import { CuestionarioService } from '../services/cuestionario.service';
import { Preguntas } from '../dtos/pregunta-dtos/preguntas.output';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
// implements IBaseResolver<Pregunta, UpdatePreguntaInput, CreatePreguntaInput>
export class PreguntaResolverCopy {
  constructor(
    private readonly preguntaServiceCopy: PreguntaServiceCopy,
    private readonly cuestionarioService: CuestionarioService,
  ) {}

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
  @Mutation(() => Pregunta, { name: 'Pregunta_create' })
  @RolesDec(...administradorUp)
  async create(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('createPreguntaInput') createPreguntaInput: CreatePreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const userId = new Types.ObjectId(user._id);
    return this.preguntaServiceCopy.pushToArray(
      idCuestionario,
      userId,
      createPreguntaInput,
    );
  }
  //#endregion

  @Query(() => Pregunta, { name: 'Pregunta' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Pregunta> {
    return this.preguntaServiceCopy.findById(idCuestionario, idPregunta);
  }

  @Query(() => [Pregunta], { name: 'Preguntas' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<Pregunta[]> {
    return (await this.cuestionarioService.findById(idCuestionario)).preguntas;
  }



  @Mutation(() => Pregunta, { name: 'Pregunta_update' })
  @RolesDec(...administradorUp)
  async update(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,

    @Args('updatePreguntaInput') updatePreguntaInput: UpdatePreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const idUpdatedBy = new Types.ObjectId(user._id);
    return this.preguntaServiceCopy.updateInArray(
      idCuestionario,
      idPregunta,
      idUpdatedBy,
      updatePreguntaInput,
    );
  }


  @Mutation(() => Pregunta, { name: 'Pregunta_softDelete' })
  @RolesDec(...administradorUp)
  async softDelete(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const idThanos = new Types.ObjectId(user._id);
    return this.preguntaServiceCopy.softDelete(
      idCuestionario,
      idPregunta,
      idThanos,
    );
  }


  @Mutation(() => Pregunta, { name: 'Pregunta_restore' })
  @RolesDec(...administradorUp)
  async restore(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user: UserRequest,
  ): Promise<Pregunta> {
    const idUser = new Types.ObjectId(user._id);
    return this.preguntaServiceCopy.restore(idCuestionario, idPregunta, idUser);
  }

  @Query(() => [Pregunta], { name: 'Pregunta_findSoftDeleted' })
  @RolesDec(...administradorUp)
  async findSoftDeleted(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<Pregunta[]> {
    return this.preguntaServiceCopy.findSoftDeleted(idCuestionario);
  }

  @Mutation(() => Pregunta, { name: 'Pregunta_hardDelete' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDelete(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
  ): Promise<Pregunta> {
    return this.preguntaServiceCopy.pullIfDeleted(idCuestionario, idPregunta);
  }

  @Mutation(() => [Pregunta], { name: 'Pregunta_hardDeleteAllSoftDeleted' })
  @RolesDec(RolEnum.SUPERADMIN)
  async hardDeleteAllSoftDeleted(
    @Args('idCuestionario', { type: () => ID }, IdPipe)
    idCuestionario: Types.ObjectId,
  ): Promise<Pregunta[]> {
    return this.preguntaServiceCopy.pullAllDeleted(idCuestionario);
  }
}
