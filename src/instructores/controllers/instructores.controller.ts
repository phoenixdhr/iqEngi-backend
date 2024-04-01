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

import { InstructoresService } from '../services/instructores.service';
import {
  CreateInstructorDto,
  UpdateInstructorDto,
} from '../dtos/instructores.dto';

@Controller('instructores')
export class InstructoresController {
  constructor(private readonly instructoresService: InstructoresService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.instructoresService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string) {
    return this.instructoresService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateInstructorDto) {
    return this.instructoresService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Nota: El código correcto para una actualización es HttpStatus.OK
  update(@Param('id') id: string, @Body() payload: UpdateInstructorDto) {
    return this.instructoresService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.DELETE) // Nota: Usualmente se usa HttpStatus.NO_CONTENT para DELETE si no se retorna contenido, pero HttpStatus.OK también es válido si se retorna el recurso eliminado.
  delete(@Param('id') id: string) {
    return this.instructoresService.delete(id);
  }
}
