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
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dtos/usuarios.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  getAll(): Usuario[] {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Usuario {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto): Usuario {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Corrige el status a OK ya que UPDATE no es un código de estado HTTP válido
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Usuario {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Utiliza NO_CONTENT para las operaciones de eliminación que no retornan contenido
  delete(@Param('id') id: string): void {
    this.usuariosService.delete(id);
  }

  @Get(':id/cursos-comprados')
  @HttpCode(HttpStatus.OK)
  getCursosComprados(@Param('id') id: string) {
    return this.usuariosService.findCursosComprados(id);
  }

  @Get(':id/progreso-cursos')
  @HttpCode(HttpStatus.OK)
  getProgresoCursos(@Param('id') id: string) {
    return this.usuariosService.findProgresoCursos(id);
  }

  @Get(':id/ordenes')
  @HttpCode(HttpStatus.OK)
  getOrdenes(@Param('id') id: string) {
    return this.usuariosService.findOrdenes(id);
  }

  @Get(':id/comentarios')
  @HttpCode(HttpStatus.OK)
  getComentarios(@Param('id') id: string) {
    return this.usuariosService.findComentarios(id);
  }
}
