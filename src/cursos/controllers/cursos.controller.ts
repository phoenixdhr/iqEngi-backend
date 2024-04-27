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
import { Curso } from '../entities/curso.entity';
import { StringNumberStringPipe } from '../../_common/pipes/string-number-string/string-number-string.pipe';
import { CreateCursoDto, UpdateCursoDto } from '../dtos/cursos.dto';

@ApiTags('cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursoService: CursosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Curso[] {
    return this.cursoService.findAll();
  }

  // @Get('filter')
  // @HttpCode(HttpStatus.OK)
  // getCursoFilter(): string {
  //   return 'yo soy un filter';
  // }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', StringNumberStringPipe) id: string): Curso {
    return this.cursoService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateCursoDto): Curso {
    return this.cursoService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', StringNumberStringPipe) id: string,
    @Body() payload: UpdateCursoDto,
  ): Curso {
    return this.cursoService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', StringNumberStringPipe) id: string): Curso {
    return this.cursoService.delete(id);
  }

  @Get(':id/ordenes')
  @HttpCode(HttpStatus.OK)
  findOrdenes(@Param('id') id: string) {
    return this.cursoService.findOrdenes(id);
  }

  @Get(':id/comentarios')
  @HttpCode(HttpStatus.OK)
  findComentarios(@Param('id') id: string) {
    return this.cursoService.findComentarios(id);
  }

  @Get(':id/cuestionarios')
  @HttpCode(HttpStatus.OK)
  findCuestionarios(@Param('id') id: string) {
    return this.cursoService.findCuestionarios(id);
  }
}
