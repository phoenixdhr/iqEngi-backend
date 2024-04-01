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

import { OrdenesService } from '../services/ordenes.service';
import { Orden } from '../entities/orden.entity'; // Asegúrate de ajustar la ruta de importación
import { CreateOrdenDto, UpdateOrdenDto } from '../dtos/orden.dto'; // Asume que tienes DTOs definidos para crear y actualizar

@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Orden[] {
    return this.ordenesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Orden {
    return this.ordenesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateOrdenDto): Orden {
    return this.ordenesService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.UPDATE) // HttpStatus.UPDATE no es un estado HTTP válido. Debes usar HttpStatus.OK para operaciones de actualización exitosas.
  update(@Param('id') id: string, @Body() payload: UpdateOrdenDto): Orden {
    return this.ordenesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // HttpStatus.DELETE no es un estado HTTP válido. Para una eliminación exitosa, se podría usar HttpStatus.OK o HttpStatus.NO_CONTENT.
  delete(@Param('id') id: string): Orden {
    return this.ordenesService.delete(id);
  }
}
