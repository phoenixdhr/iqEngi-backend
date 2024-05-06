import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasController } from './controllers/categorias.controller';
import { CategoriasService } from './services/categorias.service';
import { CursosModule } from 'src/cursos/cursos.module';
import { Categoria, CategoriaSchema } from './entities/categoria.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categoria.name, schema: CategoriaSchema },
    ]),
    forwardRef(() => CursosModule),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
