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

import { CuestionarioRespuestaUsuarioService } from '../services/cuestionario-respuesta-usuario.service';
import {
  CreateCuestionarioRespuestaUsuarioDto,
  UpdateCuestionarioRespuestaUsuarioDto,
} from '../dtos/cuestionario-respuesta-usuario.dto';
import { MongoIdPipe } from 'src/_common/pipes/mongo-id/mongo-id.pipe';

@ApiTags('cuestionario-respuesta-usuario')
@Controller('cuestionario-respuesta-usuario')
export class CuestionarioRespuestaUsuarioController {
  constructor(
    private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.cuestionarioRespuestaUsuarioService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.cuestionarioRespuestaUsuarioService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateCuestionarioRespuestaUsuarioDto) {
    return this.cuestionarioRespuestaUsuarioService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Corrección: HttpStatus.UPDATE no existe, debe ser HttpStatus.OK para una operación PUT
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateCuestionarioRespuestaUsuarioDto,
  ) {
    return this.cuestionarioRespuestaUsuarioService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Corrección: usar HttpStatus.OK es más adecuado para DELETE, HttpStatus.DELETE no existe
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.cuestionarioRespuestaUsuarioService.delete(id);
  }
}
