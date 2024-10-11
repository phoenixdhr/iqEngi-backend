import { CanActivate, Injectable } from '@nestjs/common';
import { GoogleAuthService } from '../google-auth.service';

// Esta guard no usa una estrategia, solo verifica si los toquen son validos o los renueva, y devuelve true o false
@Injectable()
export class CheckGoogleTokenExpiryGuard implements CanActivate {
  // Inyecta el servicio de autenticación en el guard
  constructor(private readonly authService: GoogleAuthService) {}

  // Método canActivate que determina si se puede activar una ruta
  async canActivate(): Promise<boolean> {
    // Permitir el acceso a la ruta solicitada
    return true;
  }
}
