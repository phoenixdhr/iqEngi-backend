import { forwardRef, Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { ComentariosModule } from 'src/comentarios/comentarios.module';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { CuestionarioRespuestaUsuarioModule } from 'src/cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';
import { ProgresoCursosModule } from 'src/progreso-cursos/progreso-cursos.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CursoComprado,
  CursoCompradoSchema,
  Perfil,
  PerfilSchema,
  Usuario,
  UsuarioSchema,
} from './entities/usuario.entity';
import { CursosModule } from 'src/cursos/cursos.module';
import { CuestionarioModule } from 'src/cuestionario/cuestionario.module';
import { EstructuraProgramariaModule } from 'src/estructura-programaria/estructura-programaria.module';

@Module({
  imports: [
    ComentariosModule,
    OrdenesModule,
    CuestionarioRespuestaUsuarioModule,
    ProgresoCursosModule,
    CuestionarioModule,
    EstructuraProgramariaModule,
    forwardRef(() => CursosModule),
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Perfil.name, schema: PerfilSchema },
      { name: CursoComprado.name, schema: CursoCompradoSchema },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
