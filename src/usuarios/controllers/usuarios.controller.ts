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
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dtos/usuarios.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';

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

  @Get(':id/cursos-comprados')
  @HttpCode(HttpStatus.OK)
  getCursosComprados(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findCursosComprados(id);
  }

  @Get(':id/progreso-cursos')
  @HttpCode(HttpStatus.OK)
  getProgresoCursos(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findProgresoCursos(id);
  }

  @Get(':id/ordenes')
  @HttpCode(HttpStatus.OK)
  getOrdenes(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findOrdenes(id);
  }

  @Get(':id/comentarios')
  @HttpCode(HttpStatus.OK)
  getComentarios(@Param('id', MongoIdPipe) id: string) {
    return this.usuariosService.findComentarios(id);
  }
}
