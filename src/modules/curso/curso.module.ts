import { Module } from '@nestjs/common';
import { CursoController } from './controllers/curso.controller';
import { CursoService } from './services/curso.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';

import { CursoResolver } from './resolvers/curso.resolver';

import { Modulo, ModuloSchema } from './entities/modulo.entity';
import { Unidad, UnidadSchema } from './entities/unidad.entity';
import { Material, MaterialSchema } from './entities/material.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Curso.name, schema: CursoSchema },
      { name: Modulo.name, schema: ModuloSchema },
      { name: Unidad.name, schema: UnidadSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),
    // forwardRef(() => OrdenModule),
    // forwardRef(() => CategoriaModule),
    // forwardRef(() => UsuarioModule),
    // ComentarioModule,
    // CuestionarioModule,
    // InstructorModule,
  ],
  controllers: [CursoController],
  providers: [CursoService, CursoResolver],
  exports: [CursoService],
})
export class CursoModule {}
