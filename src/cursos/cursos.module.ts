import { Module } from '@nestjs/common';
import { CursosController } from './controllers/cursos.controller';
import { CursosService } from './services/cursos.service';
import { ComentariosModule } from 'src/comentarios/comentarios.module';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';

@Module({
  imports: [
    ComentariosModule,
    OrdenesModule,
    CuestionarioModule,
    MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }]),
  ],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
