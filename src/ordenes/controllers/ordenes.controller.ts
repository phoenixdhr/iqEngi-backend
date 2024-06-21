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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrdenesService } from '../services/ordenes.service';
import { CreateOrdenDto, UpdateOrdenDto } from '../dtos/orden.dto'; // Asume que tienes DTOs definidos para crear y actualizar
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('ordenes')
@UseGuards(AuthGuard('jwt')) // Asegúrate de que tengas un guardia configurado
@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.ordenesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.ordenesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateOrdenDto) {
    return this.ordenesService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // HttpStatus.UPDATE no es un estado HTTP válido. Debes usar HttpStatus.OK para operaciones de actualización exitosas.
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateOrdenDto,
  ) {
    return this.ordenesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // HttpStatus.DELETE no es un estado HTTP válido. Para una eliminación exitosa, se podría usar HttpStatus.OK o HttpStatus.NO_CONTENT.
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.ordenesService.delete(id);
  }
}
