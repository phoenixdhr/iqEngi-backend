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

import { CursosService } from '../services/cursos.service';
import { Curso } from '../entities/curso.entity';
import { StringNumberStringPipe } from '../../common/string-number-string/string-number-string.pipe';
import { CreateCursoDto, UpdateCursoDto } from '../dtos/cursos.dto';

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
  @HttpCode(HttpStatus.UPDATE)
  update(
    @Param('id', StringNumberStringPipe) id: string,
    @Body() payload: UpdateCursoDto,
  ): Curso {
    return this.cursoService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.DELETE)
  delete(@Param('id', StringNumberStringPipe) id: string): Curso {
    return this.cursoService.delete(id);
  }
}
