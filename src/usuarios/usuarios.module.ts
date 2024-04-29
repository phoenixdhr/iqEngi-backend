import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { ComentariosModule } from 'src/comentarios/comentarios.module';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { CuestionarioRespuestaUsuarioModule } from 'src/cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';
import { ProgresoCursosModule } from 'src/progreso-cursos/progreso-cursos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';

@Module({
  imports: [
    ComentariosModule,
    OrdenesModule,
    CuestionarioRespuestaUsuarioModule,
    ProgresoCursosModule,
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
