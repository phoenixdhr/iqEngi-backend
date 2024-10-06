import { Module } from '@nestjs/common';
import { CursoCompradoService } from './services/curso-comprado.service';
import { CursoCompradoController } from './controllers/curso-comprado.controller';
import { CursoCompradoResolver } from './resolvers/curso-comprado.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CursoComprado,
  CursoCompradoSchema,
} from './entities/curso-comprado.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CursoComprado.name, schema: CursoCompradoSchema },
    ]),
  ],
  providers: [CursoCompradoService, CursoCompradoResolver],
  controllers: [CursoCompradoController],
})
export class CursoCompradoModule {}
