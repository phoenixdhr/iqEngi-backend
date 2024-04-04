import { Module } from '@nestjs/common';
import { CategoriasController } from './controllers/categorias.controller';
import { CategoriasService } from './services/categorias.service';
import { CursosModule } from 'src/cursos/cursos.module';

@Module({
  imports: [CursosModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
