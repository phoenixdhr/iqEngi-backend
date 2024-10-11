import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { SendMailOptions } from 'nodemailer';
import { Usuario } from '../usuario/entities/usuario.entity';
import configEnv from 'src/common/enviroments/configEnv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>,
  ) {
    // Especifica explícitamente que estamos creando un transporte SMTP
    this.transporter = nodemailer.createTransport({
      host: this.configService.email.eHost, // Dirección del servidor SMTP para enviar los correos.
      port: this.configService.email.ePort, //  Puerto utilizado por el servidor SMTP (por ejemplo, 465 para conexiones seguras).
      secure: this.configService.email.eSecure, // Indica si la conexión debe usar SSL/TLS. Generalmente true para el puerto 465 y false para el puerto 587.
      auth: {
        // Credenciales de autenticación del servidor SMTP.
        user: this.configService.email.eUser, // Usuario del servidor SMTP.
        pass: this.configService.email.ePass, // Contraseña del servidor SMTP.
      },
    } as SMTPTransport.Options); // Casting explícito
  }

  /**
   * Envía un correo de verificación al usuario.
   * @param user Usuario al que se le envía el correo.
   * @param token Token de verificación.
   */
  async sendVerificationEmail(user: Usuario, token: string): Promise<void> {
    const verificationUrl = `${this.configService.email.dominioURL}/verify-email?token=${token}`;

    const mailOptions: SendMailOptions = {
      from: `IQEngi <${this.configService.email.eUser}>`, // Remitente
      to: user.email, // Destinatario
      subject: 'Verificación de Email - IQEngi',
      html: this.getVerificationEmailTemplate(user.firstName, verificationUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el correo de verificación',
        error.message,
      );
    }
  }

  /**
   * Crea el contenido HTML del correo de verificación.
   * @param firstName Nombre del usuario.
   * @param url URL de verificación.
   * @returns Contenido HTML del correo.
   */
  private getVerificationEmailTemplate(firstName: string, url: string): string {
    return `
      <h1>Hola ${firstName},</h1>
      <p>Gracias por registrarte en nuestra plataforma. Por favor, verifica tu email haciendo clic en el siguiente enlace:</p>
      <a href="${url}">Verificar Email</a>
      <p>Este enlace expirará en 24 horas.</p>
      <hr />
      <p>Si no solicitaste esta verificación, por favor ignora este correo.</p>
    `;
  }
}
