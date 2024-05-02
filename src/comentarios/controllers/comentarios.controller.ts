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
import {
  CreateComentariosDto,
  UpdateComentariosDto,
} from '../dtos/comentario.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';

@ApiTags('comentarios')
@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.comentariosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.comentariosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateComentariosDto) {
    return this.comentariosService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Cambiado a HttpStatus.OK ya que HttpStatus.UPDATE no existe
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateComentariosDto,
  ) {
    return this.comentariosService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // Cambiado a HttpStatus.OK para la acción de DELETE, más comúnmente usado
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.comentariosService.delete(id);
  }
}
