import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('instructores')
@Controller('instructores')
export class InstructorController {}
