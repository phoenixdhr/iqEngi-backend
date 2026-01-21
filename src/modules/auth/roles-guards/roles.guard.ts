import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { RolEnum } from 'src/common/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  /**
   * Determina si el usuario tiene acceso basado en los roles requeridos.
   * @param context - Contexto de ejecución.
   * @returns `true` si el usuario tiene los permisos necesarios.
   * @throws UnauthorizedException - Si el usuario no está autenticado.
   * @throws ForbiddenException - Si el usuario no tiene los permisos adecuados.
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos para el endpoint desde el decorador `@RolesDec`.
    const requiredRoles = this.reflector.getAllAndOverride<RolEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se requieren roles específicos, permite el acceso por defecto.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Convierte el contexto a un contexto de GraphQL para obtener el usuario.
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    // Verifica que el usuario esté autenticado.
    if (!user || !user.roles) {
      throw new UnauthorizedException(
        'No se encontró el usuario autenticado en la solicitud.',
      );
    }



    // Verifica si el usuario posee alguno de los roles requeridos.
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    // Si el usuario no tiene los permisos necesarios, lanza una excepción.
    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado: Se requiere uno de los siguientes roles: [${requiredRoles.join(', ')}]`,
      );
    }

    // Permite el acceso si el usuario cumple con al menos uno de los roles requeridos.
    return true;
  }
}
