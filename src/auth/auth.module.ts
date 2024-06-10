import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { LocalStrategy } from './strategies/local.strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UsuariosModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
