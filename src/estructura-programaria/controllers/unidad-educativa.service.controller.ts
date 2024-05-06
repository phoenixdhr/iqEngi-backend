import {
  Controller,
  Get,
  // Post,
  Body,
  Put,
  Param,
  // Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';
import { UnidadEducativaService } from '../services/unidad-educativa.service';
import { CreateCuestionarioDto } from 'src/cuestionario/dtos/cuestionario.dto';

@ApiTags('unidad-educativa')
@Controller('unidad-educativa')
export class UnidadEducativaController {
  constructor(
    private readonly unidadEducativaService: UnidadEducativaService,
  ) {}
  //#region Crud Unidad
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.unidadEducativaService.findAllUnidadEducativa();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.unidadEducativaService.findUnidadEducativa(id);
  }

  // SE CREA DESDE ESTRUCTURA PROGRAMARIA
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() payload: CreateEstructuraProgramariaDto) {
  //   return this.estructuraProgramariaService.create(payload);
  // }

  // SE ACTUALIZA DESDE ESTRUCTURA PROGRAMARIA
  // @Put(':id')
  // @HttpCode(HttpStatus.OK)
  // update(
  //   @Param('id', MongoIdPipe) id: string,
  //   @Body() payload: UpdateEstructuraProgramariaDto,
  // ) {
  //   return this.estructuraProgramariaService.update(id, payload);
  // }

  // SE ELIMINA DESDE ESTRUCTURA PROGRAMARIA
  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // delete(@Param('id', MongoIdPipe) id: string) {
  //   return this.estructuraProgramariaService.delete(id);
  // }

  //#region Cuestionario
  @Put(':id/cuestionario-Add')
  @HttpCode(HttpStatus.OK)
  addCuestionario(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: CreateCuestionarioDto,
  ) {
    return this.unidadEducativaService.addCuestionarioId(id, payload);
  }
}
