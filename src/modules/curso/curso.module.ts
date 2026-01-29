import { forwardRef, Module } from '@nestjs/common';
import { CursoController } from './controllers/curso.controller';
import { CursoService } from './services/curso.service';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';

import { CursoResolver } from './resolvers/curso.resolver';

import { Modulo, ModuloSchema } from './entities/modulo.entity';
import { Unidad, UnidadSchema } from './entities/unidad.entity';
import { Material, MaterialSchema } from './entities/material.entity';
import { ModuloResolver } from './resolvers/modulo.resolver';
import { UnidadResolver } from './resolvers/unidad.resolver';
import { MaterialResolver } from './resolvers/material.resolver';
import { MaterialService } from './services/material.service';
import { UnidadService } from './services/unidad.service';
import { ModuloService } from './services/modulo.service';
import {
  CursoComprado,
  CursoCompradoSchema,
} from '../curso-comprado/entities/curso-comprado.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Curso.name, schema: CursoSchema },
      { name: Modulo.name, schema: ModuloSchema },
      { name: Unidad.name, schema: UnidadSchema },
      { name: Material.name, schema: MaterialSchema },
      // { name: CursoComprado.name, schema: CursoCompradoSchema },
    ]),
    forwardRef(() =>
      MongooseModule.forFeature([
        { name: CursoComprado.name, schema: CursoCompradoSchema },
      ]),
    ),

    // forwardRef(() => CursoCompradoModule),
    ExchangeRateModule,
  ],
  providers: [
    CursoService,
    CursoResolver,
    ModuloService,
    ModuloResolver,
    UnidadService,
    UnidadResolver,
    MaterialService,
    MaterialResolver,
  ],
  controllers: [CursoController],

  exports: [CursoService],
})
export class CursoModule { }
