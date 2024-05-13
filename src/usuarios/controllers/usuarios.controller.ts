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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UsuariosService } from '../services/usuarios.service';
import {
  AddCuestionarioDto,
  CreateCursoCompradoDto,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from '../dtos/usuarios.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';
import { ArrayCursosId } from 'src/ordenes/dtos/orden.dto';
import { CreateComentariosDto } from 'src/comentarios/dtos/comentario.dto';
import { CreateRespuestaUsuarioDTO } from 'src/cuestionario-respuesta-usuario/dtos/cuestionario-respuesta-usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  getAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Corrige el status a OK ya que UPDATE no es un código de estado HTTP válido
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Utiliza NO_CONTENT para las operaciones de eliminación que no retornan contenido
  delete(@Param('id', MongoIdPipe) id: string) {
    this.usuariosService.delete(id);
  }

  @Get(':id/curso/:id/progreso-cursos')
  @HttpCode(HttpStatus.OK)
  getProgresoCursos(
    @Param('id', MongoIdPipe) id: string,
    @Param('id', MongoIdPipe) idCurso: string,
  ) {
    return this.usuariosService.findProgresoCursosByUsuaioIdCursoId(
      id,
      idCurso,
    );
  }

  // #region Cursos Comprados
  @Put(':id/cursos-comprados')
  @HttpCode(HttpStatus.OK)
  addCursoComprado(
    @Param('id', MongoIdPipe) id: string,
    @Body() data: CreateCursoCompradoDto,
  ) {
    return this.usuariosService.addCursoComprado(id, data);
  }

  @Get(':id/cursos-comprados')
  @HttpCode(HttpStatus.OK)
  getCursosComprados(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findCursosComprados(id);
  }

  // #region Cuestionarios Respuesta
  @Put(':id/add-cuestionario-respuesta')
  @HttpCode(HttpStatus.OK)
  addCuestionarioResp(
    @Param('id', MongoIdPipe) id: string,
    @Body() data: AddCuestionarioDto,
  ) {
    return this.usuariosService.addCuestionarioRespuestaToProgesoCurso(
      id,
      data,
    );
  }

  // #region Respuestas Add
  @Put(':id/cuestionario/:cuestionarioId')
  @HttpCode(HttpStatus.OK)
  addRespuesta(
    @Param('id', MongoIdPipe) id: string,
    @Param('cuestionarioId', MongoIdPipe) cuestionarioId: string,
    @Body() data: CreateRespuestaUsuarioDTO,
  ) {
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

  @Get(':id/ordenes')
  @HttpCode(HttpStatus.OK)
  getOrdenes(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findOrdenes(id);
  }

  // #region Comentarios
  @Get(':id/comentarios')
  @HttpCode(HttpStatus.OK)
  getComentarios(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findComentarios(id);
  }

  @Post(':id/curso/:cursoId/comentarios')
  @HttpCode(HttpStatus.CREATED)
  addComentario(
    @Param('id', MongoIdPipe) id: string,
    @Param('cursoId', MongoIdPipe) cursoId: string,
    @Body() data: CreateComentariosDto,
  ) {
    return this.usuariosService.createComentario(id, cursoId, data);
  }
}
