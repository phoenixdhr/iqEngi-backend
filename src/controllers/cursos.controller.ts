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
import { StringNumberStringPipe } from '../common/string-number-string/string-number-string.pipe';
import { CreateCursoDto, UpdateCursoDto } from '../dto/cursos.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursoService: CursosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCursos() // @Query('limit') limit = 100,
  // @Query('offset') offset = 0,
  // @Query('brand') brand: string,
  : Curso[] {
    // return `Limit ${limit} Offset ${offset} Brand ${brand}`;
    return this.cursoService.findAll();
  }

  @Get('filter')
  getCursoFilter(): string {
    return 'yo soy un filter';
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  getCurso(@Param('id', StringNumberStringPipe) name: string) {
    // return { message: `Curso ${name}` };
    return this.cursoService.findOne(name);
  }

  @Post()
  createCurso(@Body() payload: CreateCursoDto) {
    // return { message: 'Curso creado', chimichangas: 'asdasd' };
    return this.cursoService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', StringNumberStringPipe) id: string,
    @Body() payload: UpdateCursoDto,
  ) {
    // return {      id,      payload,    };
    return this.cursoService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', StringNumberStringPipe) id: string) {
    // return { message: `delete ${id} success ` };
    return this.cursoService.delete(id);
  }
}
