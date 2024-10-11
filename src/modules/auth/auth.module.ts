import { forwardRef, Module } from '@nestjs/common';
import { UsuarioModule } from 'src/modules/usuario/usuario.module';
import { LocalStrategy } from './jwt-auth/strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { JwtStrategy } from './jwt-auth/strategy/jwt.strategy';
import configEnv from 'src/common/enviroments/configEnv';
import { GoogleStrategy } from './google-auth/strategy/google.strategy';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { JwtAuthService } from './jwt-auth/jwt-auth.service';
import { JwtAuthResolver } from './jwt-auth/jwt-auth.resolver';
import { GoogleAuthResolver } from './google-auth/google-auth.resolver';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsuarioModule),
    JwtModule.registerAsync({
      inject: [configEnv.KEY],
      useFactory: (configService: ConfigType<typeof configEnv>) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtAuthService,
    JwtAuthResolver,
    GoogleStrategy,
    GoogleAuthService,
    GoogleAuthResolver,
  ],
  controllers: [AuthController],
  exports: [JwtAuthService, GoogleAuthService],
})
export class AuthModule {}
