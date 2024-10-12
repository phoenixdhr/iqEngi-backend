import { RolesGuard } from './roles.guard';
import { EmailVerifiedGuard } from './email-verified.guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtGqlAuthGuard } from '../jwt-auth/jwt-auth.guard/jwt-auth.guard';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtGqlAuthGuard, // Guard para autenticación JWT
    private readonly rolesGuard: RolesGuard, // Guard para verificación de roles
    private readonly emailVerifiedGuard: EmailVerifiedGuard, // Guard para verificación de email
  ) {}

  /**
   * Aplica múltiples guardias de seguridad secuencialmente: autenticación JWT, verificación de roles y verificación de email.
   * @param context - Contexto de ejecución de la solicitud.
   * @returns `true` si todas las verificaciones son exitosas.
   * @throws Exception basada en el guard específico que falle.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Primero, autenticación JWT
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    if (!isAuthenticated) {
      return false; // Falla si el usuario no está autenticado.
    }

    // Segundo, verificación de roles
    const hasRole = await this.rolesGuard.canActivate(context);
    if (!hasRole) {
      return false; // Falla si el usuario no tiene el rol adecuado.
    }

    // Tercero, verificación de correo electrónico
    return this.emailVerifiedGuard.canActivate(context); // Falla si el email no está verificado.
  }
}
