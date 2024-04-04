import { Module } from '@nestjs/common';
import { CursosController } from './controllers/cursos.controller';
import { CursosService } from './services/cursos.service';
import { ComentariosModule } from 'src/comentarios/comentarios.module';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';

@Module({
  imports: [ComentariosModule, OrdenesModule, CuestionarioModule],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
