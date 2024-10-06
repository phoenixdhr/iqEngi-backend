import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles-auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('cursos')
@Controller('cursos')
export class CursoController {}
