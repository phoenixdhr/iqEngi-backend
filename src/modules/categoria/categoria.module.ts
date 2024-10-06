import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriaController } from './controllers/categoria.controller';
import { CategoriaService } from './services/categoria.service';
import { CursoModule } from 'src/modules/curso/curso.module';
import { Categoria, CategoriaSchema } from './entities/categoria.entity';
import { CategoriaResolver } from './resolvers/categoria.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categoria.name, schema: CategoriaSchema },
    ]),
    forwardRef(() => CursoModule),
  ],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaResolver],
  exports: [CategoriaService],
})
export class CategoriaModule {}
