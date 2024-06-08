import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLC_KEY } from '../decorators/public.decorator';
import configEnv from 'src/_common/configEnv';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(configEnv.KEY) private configService: ConfigType<typeof configEnv>,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // console.log(context);
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Auth');
    // Lógica de autenticación/autorización
    // console.log(this.configService.mongo.apiKey);
    // console.log(authHeader);

    const isAuth = authHeader === this.configService.mongo.apiKey;

    if (!isAuth) {
      throw new UnauthorizedException('Not authorized pipipi...');
    }

    return isAuth;
  }
}
