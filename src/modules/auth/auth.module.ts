import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsuarioModule } from 'src/modules/usuario/usuario.module';
import { LocalStrategy } from './strategies/local.strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy/jwt.strategy';
import { GoogleStrategyService } from './strategies/google.strategy/google.strategy';
import { AuthResolver } from './resolver/auth.resolver';
import configEnv from 'src/common/enviroments/configEnv';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [configEnv.KEY],
      useFactory: (configService: ConfigType<typeof configEnv>) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategyService,
    AuthResolver,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
