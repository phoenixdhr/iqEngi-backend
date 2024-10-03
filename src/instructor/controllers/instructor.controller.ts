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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { InstructorService } from '../services/instructor.service';
import { MongoIdPipe } from '../../_common/pipes/mongo-id/mongo-id.pipe';
import {
  CreateInstructorDto,
  UpdateInstructorDto,
  FilterInstructorDto,
} from '../dtos/instructor.dto';

@ApiTags('instructores')
@Controller('instructores')
export class InstructorController {
  constructor(private readonly instructoresService: InstructorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@Query() params: FilterInstructorDto) {
    return this.instructoresService.findAll(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.instructoresService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateInstructorDto) {
    return this.instructoresService.create(data);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Nota: El código correcto para una actualización es HttpStatus.OK
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() changes: UpdateInstructorDto,
  ) {
    return this.instructoresService.update(id, changes);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // Nota: Usualmente se usa HttpStatus.NO_CONTENT para DELETE si no se retorna contenido, pero HttpStatus.OK también es válido si se retorna el recurso eliminado.
  delete(@Param('id', MongoIdPipe) id: string) {
    const webada = this.instructoresService.delete(id);
    return webada;
  }
}
// function getOne(arg0: any, id: any, string: any) {
//   throw new Error('Function not implemented.');
// }
