import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';

@UseGuards(JwtGqlAuthGuard, RolesGuard)
@ApiTags('cursos')
@Controller('cursos')
export class CursoController {}
