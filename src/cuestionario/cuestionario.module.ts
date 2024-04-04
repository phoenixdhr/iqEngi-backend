import { Module } from '@nestjs/common';
import { CuestionarioService } from './services/cuestionario.service';
import { CuestionarioController } from './controllers/cuestionario.controller';

@Module({
  providers: [CuestionarioService],
  controllers: [CuestionarioController],
  exports: [CuestionarioService],
})
export class CuestionarioModule {}
