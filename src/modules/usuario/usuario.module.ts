import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './services/usuario.service';
import { OrdenModule } from 'src/modules/orden/orden.module';
import { RespuestaCuestionarioModule } from 'src/modules/respuesta-cuestionario/respuesta-cuestionario.module';
import { MongooseModule } from '@nestjs/mongoose';

import { CursoModule } from 'src/modules/curso/curso.module';
import { CuestionarioModule } from 'src/modules/cuestionario/cuestionario.module';
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { ComentarioModule } from '../comentario/comentario.module';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import { Perfil, PerfilSchema } from './entities/perfil.entity';
import { UsuarioController } from './controllers/usuario.controller';
import {
  CursoComprado,
  CursoCompradoSchema,
} from '../curso-comprado/entities/curso-comprado.entity';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MailModule,
    ComentarioModule,
    OrdenModule,
    RespuestaCuestionarioModule,
    CuestionarioModule,
    forwardRef(() => CursoModule),
    forwardRef(() => AuthModule),
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
