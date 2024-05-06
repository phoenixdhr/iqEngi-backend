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
import { EstructuraProgramariaService } from '../services/estructura-programaria.service';
import {
  CreateEstructuraProgramariaDto,
  CreateUnidadEducativaDto,
  UpdateEstructuraProgramariaDto,
} from '../dtos/estructura-Programaria.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';
import { UnidadEducativaService } from '../services/unidad-educativa.service';

@ApiTags('estructura-Programaria')
@Controller('estructura-Programaria')
export class EstructuraProgramariaController {
  constructor(
    private readonly estructuraProgramariaService: EstructuraProgramariaService,
    private readonly unidadEducativaService: UnidadEducativaService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.estructuraProgramariaService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.estructuraProgramariaService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateEstructuraProgramariaDto) {
    return this.estructuraProgramariaService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateEstructuraProgramariaDto,
  ) {
    return this.estructuraProgramariaService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.estructuraProgramariaService.delete(id);
  }

  @Put(':id/unidad-educativa-Add')
  @HttpCode(HttpStatus.OK)
  addUnidadEducativa(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: CreateUnidadEducativaDto,
  ) {
    return this.unidadEducativaService.addUnidadEducativa(id, payload);
  }
}
