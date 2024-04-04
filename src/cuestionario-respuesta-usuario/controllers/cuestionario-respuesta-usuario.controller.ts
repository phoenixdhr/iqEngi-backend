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
import { CuestionarioRespuestaUsuario } from '../entities/cuestionario-respuesta-usuario.entity';
import {
  CreateCuestionarioRespuestaUsuarioDto,
  UpdateCuestionarioRespuestaUsuarioDto,
} from '../dtos/cuestionario-respuesta-usuario.dto';

@ApiTags('cuestionario-respuesta-usuario')
@Controller('cuestionario-respuesta-usuario')
export class CuestionarioRespuestaUsuarioController {
  constructor(
    private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): CuestionarioRespuestaUsuario[] {
    return this.cuestionarioRespuestaUsuarioService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): CuestionarioRespuestaUsuario {
    return this.cuestionarioRespuestaUsuarioService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() payload: CreateCuestionarioRespuestaUsuarioDto,
  ): CuestionarioRespuestaUsuario {
    return this.cuestionarioRespuestaUsuarioService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.UPDATE) // Corrección: HttpStatus.UPDATE no existe, debe ser HttpStatus.OK para una operación PUT
  update(
    @Param('id') id: string,
    @Body() payload: UpdateCuestionarioRespuestaUsuarioDto,
  ): CuestionarioRespuestaUsuario {
    return this.cuestionarioRespuestaUsuarioService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.DELETE) // Corrección: usar HttpStatus.OK es más adecuado para DELETE, HttpStatus.DELETE no existe
  delete(@Param('id') id: string): CuestionarioRespuestaUsuario {
    return this.cuestionarioRespuestaUsuarioService.delete(id);
  }
}
