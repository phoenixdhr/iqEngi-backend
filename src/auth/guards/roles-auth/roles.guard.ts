// src/auth/guards/roles.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../../decorators/roles.decorator';
import { RolEnum } from '../../enums/roles.model';
import { UserRequest } from 'src/auth/entities/type-gql/user_jwt.entity';

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

    // Si no se definen roles requeridos, permitir el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener la solicitud HTTP y los datos del usuario
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserRequest;

    // Asegurarse de que el usuario tenga roles
    if (!user || !user.roles) {
      throw new UnauthorizedException(
        `´El usuario ${user.email} con persmisos ${user.roles} no tiene permisos suficientes ${requiredRoles}`,
      );
    }

    // Verificar si alguno de los roles del usuario coincide con los roles requeridos
    const hasRole = user.roles.some((role) => requiredRoles.includes(role));

    // Si el usuario tiene al menos uno de los roles requeridos, permitir el acceso
    if (hasRole) {
      return true;
    }

    // Si no coincide ningún rol, lanzar excepción
    throw new UnauthorizedException('No tienes permisos suficientes');
  }
}
