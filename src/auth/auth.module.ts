import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { LocalStrategy } from './strategies/local.strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy/jwt.strategy';
import { GoogleStrategyService } from './strategies/google.strategy/google.strategy';
import configEnv from 'src/_common/configEnv';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [configEnv.KEY],
      useFactory: (configService: ConfigType<typeof configEnv>) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategyService],
  controllers: [AuthController],
})
export class AuthModule {}
