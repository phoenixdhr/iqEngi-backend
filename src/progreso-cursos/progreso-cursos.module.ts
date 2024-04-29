import { Module } from '@nestjs/common';
import { ProgresoCursosController } from './controllers/progreso-cursos.controller';
import { ProgresoCursosService } from './services/progreso-cursos.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProgresoCurso,
  ProgresoCursoSchema,
} from './entities/progreso-curso.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgresoCurso.name, schema: ProgresoCursoSchema },
    ]),
  ],
  controllers: [ProgresoCursosController],
  providers: [ProgresoCursosService],
  exports: [ProgresoCursosService],
})
export class ProgresoCursosModule {}
