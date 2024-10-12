import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  /**
   * Verifica si el usuario ha confirmado su email antes de permitir el acceso.
   * @param context - Contexto de ejecución de la solicitud.
   * @returns `true` si el email del usuario está verificado.
   * @throws ForbiddenException - Si el usuario no está autenticado o su email no está verificado.
   */
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context); // Convertir el contexto al de GraphQL.
    const { user } = ctx.getContext().req; // Obtener el usuario desde el contexto de la solicitud.

    // Verificar si el usuario está autenticado.
    if (!user) {
      throw new ForbiddenException('Acceso denegado: Usuario no autenticado.');
    }

    // Verificar si el email del usuario ha sido verificado.
    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Acceso denegado: Debes verificar tu correo electrónico para acceder a este recurso.',
      );
    }

    // Permitir el acceso si el email está verificado.
    return true;
  }
}
