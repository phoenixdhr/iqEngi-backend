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

import { ProgresoCursosService } from '../services/progreso-cursos.service';
import { ProgresoCurso } from '../entities/progreso-curso.entity';
import {
  CreateProgresoCursoDto,
  UpdateProgresoCursoDto,
} from '../dtos/progresoCurso.dto';

@ApiTags('progreso-cursos')
@Controller('progreso-cursos')
export class ProgresoCursosController {
  constructor(private readonly progresoCursosService: ProgresoCursosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): ProgresoCurso[] {
    return this.progresoCursosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): ProgresoCurso {
    return this.progresoCursosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateProgresoCursoDto): ProgresoCurso {
    return this.progresoCursosService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Corrección: HttpStatus.UPDATE no existe, debe ser HttpStatus.OK para una operación PUT
  update(
    @Param('id') id: string,
    @Body() payload: UpdateProgresoCursoDto,
  ): ProgresoCurso {
    return this.progresoCursosService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Corrección: usar HttpStatus.OK es más adecuado para DELETE, HttpStatus.DELETE no existe
  delete(@Param('id') id: string): ProgresoCurso {
    return this.progresoCursosService.delete(id);
  }
}
