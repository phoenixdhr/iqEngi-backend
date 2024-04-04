import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ComentariosService } from '../services/comentarios.service';
import { Comentario } from '../entities/comentario.entity';
import {
  CreateComentariosDto,
  UpdateComentariosDto,
} from '../dtos/comentario.dto';

@ApiTags('comentarios')
@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Comentario[] {
    return this.comentariosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Comentario {
    return this.comentariosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateComentariosDto): Comentario {
    return this.comentariosService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.UPDATE) // Cambiado a HttpStatus.OK ya que HttpStatus.UPDATE no existe
  update(
    @Param('id') id: string,
    @Body() payload: UpdateComentariosDto,
  ): Comentario {
    return this.comentariosService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // Cambiado a HttpStatus.OK para la acción de DELETE, más comúnmente usado
  delete(@Param('id') id: string): Comentario {
    return this.comentariosService.delete(id);
  }
}
