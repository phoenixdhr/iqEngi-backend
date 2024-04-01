import { Module } from '@nestjs/common';
import { CategoriasController } from './controllers/categorias.controller';
import { CategoriasService } from './services/categorias.service';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
