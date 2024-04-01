import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
