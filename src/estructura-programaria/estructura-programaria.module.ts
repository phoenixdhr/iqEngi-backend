import { Module } from '@nestjs/common';
import { EstructuraProgramariaService } from './services/estructura-programaria.service';
import { EstructuraProgramariaController } from './controllers/estructura-programaria.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EstructuraProgramaria,
  EstructuraProgramariaSchema,
  UnidadEducativa,
  UnidadEducativaSchema,
} from './entities/estructura-programaria.entity';
import { UnidadEducativaService } from './services/unidad-educativa.service';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { UnidadEducativaController } from './controllers/unidad-educativa.service.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EstructuraProgramaria.name, schema: EstructuraProgramariaSchema },
      { name: UnidadEducativa.name, schema: UnidadEducativaSchema },
    ]),
    CuestionarioModule,
  ],
  providers: [EstructuraProgramariaService, UnidadEducativaService],
  controllers: [EstructuraProgramariaController, UnidadEducativaController],
  exports: [EstructuraProgramariaService],
})
export class EstructuraProgramariaModule {}
