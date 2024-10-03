import { forwardRef, Module } from '@nestjs/common';
import { UsuarioController } from './controllers/usuario.controller';
import { UsuarioService } from './services/usuario.service';
import { ComentarioModule } from 'src/comentario/comentario.module';
import { OrdenModule } from 'src/orden/orden.module';
import { CuestionarioRespuestaUsuarioModule } from 'src/cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';
import { ProgresoCursoModule } from 'src/progreso-curso/progreso-curso.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CursoComprado,
  CursoCompradoSchema,
  Perfil,
  PerfilSchema,
  Usuario,
  UsuarioSchema,
} from './entities/usuario.entity';
import { CursoModule } from 'src/curso/curso.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { EstructuraProgramariaModule } from 'src/estructura-programaria/estructura-programaria.module';
import { UsuarioResolver } from './resolver/usuario.resolver';

@Module({
  imports: [
    ComentarioModule,
    OrdenModule,
    CuestionarioRespuestaUsuarioModule,
    ProgresoCursoModule,
    CuestionarioModule,
    EstructuraProgramariaModule,
    forwardRef(() => CursoModule),
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Perfil.name, schema: PerfilSchema },
      { name: CursoComprado.name, schema: CursoCompradoSchema },
    ]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioResolver],
  exports: [UsuarioService],
})
export class UsuarioModule {}
