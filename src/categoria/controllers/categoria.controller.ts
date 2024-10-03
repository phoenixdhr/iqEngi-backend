import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CategoriaService } from '../services/categoria.service';
import { MongoIdPipe } from '../../_common/pipes/mongo-id/mongo-id.pipe';
// import { Categoria } from '../entities/categoria.entity';
// Asegúrate de importar o definir los DTOs para crear y actualizar categorías
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dtos/categoria.dto';
// import { Curso } from '../../cursos/entities/curso.entity';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriasService: CategoriaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id', MongoIdPipe) id: string) {
    return this.categoriasService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', MongoIdPipe) id: string) {
    return this.categoriasService.delete(id);
  }

  @Get(':id/cursos')
  @HttpCode(HttpStatus.OK)
  getCursos(@Param('id', MongoIdPipe) id: string) {
    return this.categoriasService.findCursosByCategoriaId(id);
  }
}
