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

import { CuestionarioService } from '../services/cuestionario.service';
import {
  CreateCuestionarioDto,
  UpdateCuestionarioDto,
} from '../dtos/cuestionario.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';

@ApiTags('cuestionarios')
@Controller('cuestionarios') // Asegúrate de que el nombre del controlador refleje la ruta que quieres usar
export class CuestionarioController {
  constructor(private readonly cuestionarioService: CuestionarioService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.cuestionarioService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.cuestionarioService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateCuestionarioDto) {
    return this.cuestionarioService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Cambiado de HttpStatus.UPDATE porque UPDATE no es un estado HTTP válido
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateCuestionarioDto,
  ) {
    return this.cuestionarioService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // Cambiado a OK porque es más común para la acción DELETE
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.cuestionarioService.delete(id);
  }
}
