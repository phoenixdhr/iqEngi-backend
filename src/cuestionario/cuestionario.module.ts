import { forwardRef, Module } from '@nestjs/common';
import { CuestionarioService } from './services/cuestionario.service';
import { CuestionarioController } from './controllers/cuestionario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cuestionario,
  CuestionarioSchema,
  Pregunta,
  PreguntaSchema,
} from './entities/cuestionario.entity';
import { EstructuraProgramariaModule } from 'src/estructura-programaria/estructura-programaria.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cuestionario.name, schema: CuestionarioSchema },
      { name: Pregunta.name, schema: PreguntaSchema },
    ]),
    forwardRef(() => EstructuraProgramariaModule),
  ],
  providers: [CuestionarioService],
  controllers: [CuestionarioController],
  exports: [CuestionarioService],
})
export class CuestionarioModule {}
