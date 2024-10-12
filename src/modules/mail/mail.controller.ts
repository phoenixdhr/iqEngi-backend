// }
import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Verifica el email del usuario a través de un token.
   * Redirige al usuario a una URL de éxito o error según el resultado de la verificación.
   * @param token - Token de verificación recibido como parámetro de consulta.
   * @returns URL de redirección basada en el resultado de la verificación.
   */
  @Get('verify-email')
  @Redirect() // Redirige automáticamente a la URL que retorna el método.
  async verifyEmail(@Query('token') token: string) {
    const redirectUrl = await this.mailService.verifyEmail(token);
    return { url: redirectUrl }; // Redirecciona a la URL devuelta por el servicio.
  }

  /**
   * Punto final para confirmar la verificación de email exitosa.
   * @returns Mensaje de éxito al verificar el email.
   */
  @Get('verification-success')
  async verificationSuccess() {
    return '¡Correo verificado exitosamente!'; // Mensaje de confirmación de verificación.
  }
}
