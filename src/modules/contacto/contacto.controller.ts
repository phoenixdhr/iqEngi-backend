import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { CrearContactoDto } from './dtos/crear-contacto.dto';
import { ContactoResponseDto } from './dtos/contacto-response.dto';

import { IsPublic } from '../auth/decorators/public.decorator';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  /**
   * Endpoint público para enviar formulario de contacto
   * POST /contacto
   */
  @IsPublic()
  @Post()
  @HttpCode(HttpStatus.OK)
  async enviarContacto(
    @Body() crearContactoDto: CrearContactoDto,
  ): Promise<ContactoResponseDto> {
    return this.contactoService.procesarContacto(crearContactoDto);
  }

  //FALTAN LOS RESOLVERS PARA CONSULTAR LOS CONTACTOS
}
