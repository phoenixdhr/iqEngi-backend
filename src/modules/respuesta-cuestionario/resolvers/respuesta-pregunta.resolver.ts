import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IResolver_SubDocument } from 'src/common/interfaces/resolver-base-subdoc.interface';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RespuestaPregunta } from '../entities/respuesta-pregunta.entity';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { administradorUp } from 'src/common/enums/rol.enum';
import { CreateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/create-respuesta-pregunta.dto';
import { UpdateRespuestaPreguntaInput } from '../dtos/respuesta-pregunta-dtos/update-respuesta-pregunta.dto';
import { RespuestaPreguntaService } from '../services/respuesta-pregunta.service';
import { RespuestaCuestionarioService } from '../services/respuesta-cuestionario.service';

@Resolver()
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class RespuestaPreguntaResolver
  implements
    IResolver_SubDocument<
      RespuestaPregunta,
      CreateRespuestaPreguntaInput,
      UpdateRespuestaPreguntaInput
    >
{
  constructor(
    private readonly preguntaService: RespuestaPreguntaService,
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService,
  ) {}

  //#region Create
  /**
   * Crea una nueva pregunta en un cuestionario específico.
   *
   * @param idRespuestaCuestionario ID del cuestionario al que se agregará la pregunta.
   * @param createRespuestaPreguntaInput Datos necesarios para crear la pregunta.
   * @param user Usuario autenticado que realiza la creación.
   * @returns La pregunta creada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Mutation(() => RespuestaPregunta, { name: 'RespuestaPregunta_create' })
  @RolesDec(...administradorUp)
  async create(
    /*     @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId, */
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('createRespuestaPreguntaInput')
    createRespuestaPreguntaInput: CreateRespuestaPreguntaInput,
    @CurrentUser() user: UserRequest,
  ): Promise<RespuestaPregunta> {
    const userId = new Types.ObjectId(user._id);

    return await this.preguntaService._pushToArray(
      idCurso,
      userId,
      createRespuestaPreguntaInput,
      'respuestas',
    );
  }
  //#endregion

  //#region Read
  /**
   * Obtiene una pregunta específica dentro de un cuestionario.
   *
   * @param idCurso ID del cuestionario que contiene la pregunta.
   * @param idPregunta ID de la pregunta a buscar.
   * @returns La pregunta encontrada.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => RespuestaPregunta, { name: 'RespuestaPregunta' })
  @RolesDec(...administradorUp)
  async findById(
    @Args('idCurso', { type: () => ID }, IdPipe)
    idCurso: Types.ObjectId,
    @Args('idPregunta', { type: () => ID }, IdPipe) idPregunta: Types.ObjectId,
    @CurrentUser() user?: UserRequest,
  ): Promise<RespuestaPregunta> {
    const userId = new Types.ObjectId(user._id);

    return this.preguntaService._findById(idCurso, idPregunta, userId);
  }

  /**
   * Obtiene todas las preguntas de un cuestionario.
   *
   * @param idRespuestaCuestionario ID del cuestionario.
   * @returns Una lista de preguntas.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  @Query(() => [RespuestaPregunta], { name: 'RespuestaPreguntas' })
  @RolesDec(...administradorUp)
  async findAll(
    @Args('idRespuestaCuestionario', { type: () => ID }, IdPipe)
    idRespuestaCuestionario: Types.ObjectId,
  ): Promise<RespuestaPregunta[]> {
    return (await this.preguntaService.findAll(idRespuestaCuestionario))
      .respuestas;
  }
}
