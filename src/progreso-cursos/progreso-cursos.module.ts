import { Module } from '@nestjs/common';
import { ProgresoCursosController } from './controllers/progreso-cursos.controller';
import { ProgresoCursosService } from './services/progreso-cursos.service';

@Module({
  controllers: [ProgresoCursosController],
  providers: [ProgresoCursosService],
})
export class ProgresoCursosModule {}
