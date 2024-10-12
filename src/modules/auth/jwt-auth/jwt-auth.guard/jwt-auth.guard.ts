import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class JwtGqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Verifica si se permite el acceso a la ruta.
   * @param context - Contexto de ejecución.
   * @returns `true` si la ruta es pública o si el token JWT es válido.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Usa Reflector para determinar si la ruta es pública a través del decorador `@IsPublic`.
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true; // Si es pública, se permite el acceso sin autenticación.
    }

    // Si la ruta no es pública, procede con la validación del token JWT.
    return super.canActivate(context);
  }

  /**
   * Obtiene la solicitud de contexto de GraphQL.
   * @param context - Contexto de ejecución.
   * @returns La solicitud HTTP para que `AuthGuard` pueda validarla.
   * @throws UnauthorizedException - Si no se puede obtener la solicitud del contexto.
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context); // Convierte el contexto a un contexto de GraphQL.
    const request = ctx.getContext().req; // Obtiene la solicitud HTTP del contexto de GraphQL.

    if (!request) {
      throw new UnauthorizedException(
        'No se pudo obtener la solicitud del contexto GraphQL.',
      );
    }

    return request; // Devuelve la solicitud para que `AuthGuard` procese la autenticación.
  }
}
