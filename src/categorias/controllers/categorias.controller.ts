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
import { CategoriasService } from '../services/categorias.service';
import { Categoria } from '../entities/categoria.entity';
// Asegúrate de importar o definir los DTOs para crear y actualizar categorías
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dtos/categorias.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Categoria[] {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Categoria {
    return this.categoriasService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoriaDto: CreateCategoriaDto): Categoria {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ): Categoria {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.DELETE)
  delete(@Param('id') id: string): void {
    this.categoriasService.delete(id);
  }
}
