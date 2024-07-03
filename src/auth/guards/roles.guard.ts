// src/auth/guards/roles.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { RolEnum } from '../models/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Método principal que determina si el usuario tiene acceso
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obtener los roles requeridos para el manejador actual
    const requiredRoles = this.reflector.get<RolEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    console.log('requiredRoles', requiredRoles);
    // Si no se definen roles requeridos, permitir el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener la solicitud HTTP y los datos del usuario
    const request = context.switchToHttp().getRequest();
    console.log('request.user', request.user);
    const user = request.user as PayloadToken;
    const userRole = user.rol as RolEnum;

    console.log('userRole', userRole);
    // Verificar si el rol del usuario está entre los roles requeridos
    const hasRole = requiredRoles.includes(userRole);
    if (!hasRole) {
      // Lanzar una excepción si el usuario no tiene el rol necesario
      throw new UnauthorizedException('No tienes permisos suficientes');
    }

    // Permitir el acceso si el usuario tiene el rol necesario
    return hasRole;
  }
}
