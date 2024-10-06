import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cuestionarios')
@Controller('cuestionarios') // Asegúrate de que el nombre del controlador refleje la ruta que quieres usar
export class CuestionarioController {}
