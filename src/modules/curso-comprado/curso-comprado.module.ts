import { forwardRef, Module } from '@nestjs/common';
import { CursoCompradoService } from './services/curso-comprado.service';
import { CursoCompradoController } from './controllers/curso-comprado.controller';
import { CursoCompradoResolver } from './resolvers/curso-comprado.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CursoComprado,
  CursoCompradoSchema,
} from './entities/curso-comprado.entity';
import { CursoModule } from '../curso/curso.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CursoComprado.name, schema: CursoCompradoSchema },
    ]),
    forwardRef(() => CursoModule),
  ],
  providers: [CursoCompradoService, CursoCompradoResolver],
  controllers: [CursoCompradoController],
  exports: [CursoCompradoService],
})
export class CursoCompradoModule {}
