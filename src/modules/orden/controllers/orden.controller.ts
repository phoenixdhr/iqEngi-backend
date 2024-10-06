import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ordenes')
@UseGuards(AuthGuard('jwt')) // Asegúrate de que tengas un guardia configurado
@Controller('ordenes')
export class OrdenController {}
