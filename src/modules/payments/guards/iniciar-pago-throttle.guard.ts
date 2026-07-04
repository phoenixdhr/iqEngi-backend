import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Guard anti-spam para la mutación `iniciarPago`.
 *
 * Capa 2 de la estrategia anti-duplicación de pagos:
 * Bloquea peticiones repetidas del mismo usuario dentro de una ventana
 * de 5 segundos. Si un segundo request llega antes de que la ventana
 * expire, se rechaza inmediatamente con HTTP 429 sin ejecutar ninguna
 * lógica de base de datos.
 *
 * Implementación: Map en memoria (key = userId, value = timestamp).
 * Se limpia automáticamente cada 60 segundos para evitar fuga de memoria.
 */
@Injectable()
export class IniciarPagoThrottleGuard implements CanActivate {
  private readonly logger = new Logger(IniciarPagoThrottleGuard.name);

  /** Ventana de bloqueo en milisegundos */
  private static readonly WINDOW_MS = 5_000;

  /** Intervalo de limpieza del Map en milisegundos */
  private static readonly CLEANUP_INTERVAL_MS = 60_000;

  /** Registro de último intento por usuario: userId → timestamp */
  private readonly lastAttempt = new Map<string, number>();

  constructor() {
    // Limpieza periódica: elimina entradas expiradas para evitar fuga de memoria
    // en procesos de larga duración.
    setInterval(() => {
      const now = Date.now();
      for (const [key, ts] of this.lastAttempt) {
        if (now - ts > IniciarPagoThrottleGuard.WINDOW_MS) {
          this.lastAttempt.delete(key);
        }
      }
    }, IniciarPagoThrottleGuard.CLEANUP_INTERVAL_MS);
  }

  canActivate(context: ExecutionContext): boolean {
    // Extraer el usuario del contexto GraphQL (inyectado por JwtGqlAuthGuard)
    const gqlCtx = GqlExecutionContext.create(context);
    const user = gqlCtx.getContext().req?.user;

    // Si no hay usuario autenticado, dejamos pasar: el JwtGqlAuthGuard
    // (que se ejecuta antes) se encargará de rechazarlo.
    if (!user?._id) return true;

    const userId = String(user._id);
    const now = Date.now();
    const lastTs = this.lastAttempt.get(userId);

    if (lastTs && now - lastTs < IniciarPagoThrottleGuard.WINDOW_MS) {
      const waitSec = Math.ceil(
        (IniciarPagoThrottleGuard.WINDOW_MS - (now - lastTs)) / 1000,
      );
      this.logger.warn(
        `Rate limit: usuario ${userId} bloqueado. Debe esperar ${waitSec}s.`,
      );
      throw new HttpException(
        `Estamos procesando tu solicitud. Intenta de nuevo en ${waitSec} segundo(s).`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Registrar este intento
    this.lastAttempt.set(userId, now);
    return true;
  }
}
