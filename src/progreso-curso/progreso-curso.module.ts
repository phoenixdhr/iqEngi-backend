import { Module } from '@nestjs/common';
import { ProgresoCursoController } from './controllers/progreso-curso.controller';
import { ProgresoCursoService } from './services/progreso-curso.service';
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
  controllers: [ProgresoCursoController],
  providers: [ProgresoCursoService],
  exports: [ProgresoCursoService],
})
export class ProgresoCursoModule {}
