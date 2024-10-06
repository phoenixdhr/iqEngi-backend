import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriaController {}
