import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  // Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

import { UsuarioService } from '../services/usuario.service';
import {
  AddCuestionarioDto,
  CreateCursoCompradoDto,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from '../dtos/usuario.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';
import { ArrayCursosId } from 'src/orden/dtos/orden.dto';
import { CreateComentariosDto } from 'src/comentario/dtos/comentario.dto';
import { CreateRespuestaUsuarioDTO } from 'src/cuestionario-respuesta-usuario/dtos/cuestionario-respuesta-usuario.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-auth/roles.guard';
import { RolesDec } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/roles.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserRequest } from 'src/auth/entities/type-gql/user_jwt.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuariosService: UsuarioService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @RolesDec(RolEnum.ADMINISTRADOR)
  getAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RolesDec(RolEnum.ADMINISTRADOR)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put('/update')
  @HttpCode(HttpStatus.OK) // Corrige el status a OK ya que UPDATE no es un código de estado HTTP válido
  update(@Req() req: Request, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;

    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Utiliza NO_CONTENT para las operaciones de eliminación que no retornan contenido
  @RolesDec(RolEnum.ADMINISTRADOR, RolEnum.ESTUDIANTE)
  delete(@Param('id', MongoIdPipe) id: string) {
    this.usuariosService.delete(id);
  }

  @Get('curso/:id/progreso-cursos')
  @HttpCode(HttpStatus.OK)
  getProgresoCursos(
    @Req() req: Request,
    @Param('id', MongoIdPipe) idCurso: string,
  ) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.findProgresoCursosByUsuaioIdCursoId(
      id,
      idCurso,
    );
  }

  // #region Cursos Comprados

  @Put('cursos-comprados/put')
  @HttpCode(HttpStatus.OK)
  addCursoComprado(@Req() req: Request, @Body() data: CreateCursoCompradoDto) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.addCursoComprado(id, data);
  }

  @Get('cursos-comprados/get')
  @HttpCode(HttpStatus.OK)
  getCursosComprados(@Req() req: Request) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;

    return this.usuariosService.findCursosComprados(id);
  }

  // #region Cuestionarios Respuesta
  @Put('add-cuestionario-respuesta')
  @HttpCode(HttpStatus.OK)
  addCuestionarioResp(@Req() req: Request, @Body() data: AddCuestionarioDto) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.addCuestionarioRespuestaToProgesoCurso(
      id,
      data,
    );
  }

  // #region Respuestas Add
  @Put('add-Respuesta/:cuestionarioId')
  @HttpCode(HttpStatus.OK)
  addRespuesta(
    @Req() req: Request,
    @Param('cuestionarioId', MongoIdPipe) cuestionarioId: string,
    @Body() data: CreateRespuestaUsuarioDTO,
  ) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.addRespuesta(id, cuestionarioId, data);
  }

  // #region Ordenes
  @Put(':id/create-orden')
  @HttpCode(HttpStatus.OK)
  createOrden(
    @Param('id', MongoIdPipe) id: string,
    @Body() arrayCursos: ArrayCursosId,
  ) {
    return this.usuariosService.createOrden(id, arrayCursos);
  }

  @Put('create-orden')
  @HttpCode(HttpStatus.OK)
  createOrden2(@Req() req: Request, @Body() arrayCursos: ArrayCursosId) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;

    return this.usuariosService.createOrden(id, arrayCursos);
  }

  @Get(':id/ordenes')
  @HttpCode(HttpStatus.OK)
  getOrdenes(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findOrdenes(id);
  }

  @Get('ordenes')
  @HttpCode(HttpStatus.OK)
  getOrdenes2(@Req() req: Request) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.findOrdenes(id);
  }

  // #region Comentarios
  @Get('comentarios')
  @HttpCode(HttpStatus.OK)
  getComentarios(@Req() req: Request) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.findComentarios(id);
  }

  @Post('curso/:cursoId/comentarios')
  @HttpCode(HttpStatus.CREATED)
  addComentario(
    @Req() req: Request,
    @Param('cursoId', MongoIdPipe) cursoId: string,
    @Body() data: CreateComentariosDto,
  ) {
    const userRequest = req.user as UserRequest;
    const id = userRequest._id;
    return this.usuariosService.createComentario(id, cursoId, data);
  }
}
