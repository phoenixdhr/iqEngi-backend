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
import { ApiTags } from '@nestjs/swagger';

import { CursosService } from '../services/cursos.service';
import { CreateCursoDto, UpdateCursoDto } from '../dtos/cursos.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';
import { CreateEstructuraProgramariaDto } from 'src/estructura-programaria/dtos/estructura-Programaria.dto';

@ApiTags('cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursoService: CursosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.cursoService.findAll();
  }

  // @Get('filter')
  // @HttpCode(HttpStatus.OK)
  // getCursoFilter(): string {
  //   return 'yo soy un filter';
  // }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.cursoService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateCursoDto) {
    return this.cursoService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateCursoDto,
  ) {
    return this.cursoService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.cursoService.delete(id);
  }

  @Get(':id/ordenes')
  @HttpCode(HttpStatus.OK)
  findOrdenes(@Param('id', MongoIdPipe) id: string) {
    return this.cursoService.findOrdenesByCursoId(id);
  }

  @Get(':id/comentarios')
  @HttpCode(HttpStatus.OK)
  findComentarios(@Param('id', MongoIdPipe) id: string) {
    return this.cursoService.findComentariosByCursoId(id);
  }

  @Get(':id/cuestionarios')
  @HttpCode(HttpStatus.OK)
  findCuestionarios(@Param('id', MongoIdPipe) id: string) {
    return this.cursoService.findCuestionariosByCursoId(id);
  }

  @Put(':id/estructura-programaria')
  @HttpCode(HttpStatus.OK)
  addEstructuraProgramaria(
    @Param('id', MongoIdPipe) id: string,
    @Body()
    estructuraProgramaria: CreateEstructuraProgramariaDto,
  ) {
    return this.cursoService.addEstructuraProgramaria(
      id,
      estructuraProgramaria,
    );
  }
}
