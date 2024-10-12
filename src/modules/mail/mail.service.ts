import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

import { ConfigType } from '@nestjs/config';
import { SendMailOptions } from 'nodemailer';
import { Usuario } from '../usuario/entities/usuario.entity';
import configEnv from 'src/common/enviroments/configEnv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { UserRequest } from '../auth/entities/user-request.entity';
import { UsuarioService } from '../usuario/services/usuario.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>, // Inyección de configuración de entorno.
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService, // Servicio de usuario para obtener detalles del usuario.
  ) {
    // Configuración del transporte SMTP para envío de correos.
    this.transporter = nodemailer.createTransport({
      host: this.configService.email.eHost,
      port: this.configService.email.ePort,
      secure: this.configService.email.eSecure,
      auth: {
        user: this.configService.email.eUser,
        pass: this.configService.email.ePass,
      },
    } as SMTPTransport.Options); // Configuración explícita de opciones SMTP.
  }

  /**
   * Envía un correo electrónico de verificación al usuario.
   * @param user - Instancia del usuario a verificar.
   * @param token - Token de verificación a incluir en el correo.
   * @throws InternalServerErrorException - Si falla el envío del correo.
   */
  async sendVerificationEmail(user: Usuario, token: string): Promise<void> {
    const verificationUrl = `${this.configService.email.dominioURL}/email/verify-email?token=${token}`;

    const mailOptions: SendMailOptions = {
      from: `IQEngi <${this.configService.email.eUser}>`, // Remitente.
      to: user.email, // Destinatario.
      subject: 'Verificación de Email - IQEngi', // Asunto del correo.
      html: this.getVerificationEmailTemplate(user.firstName, verificationUrl), // Contenido HTML.
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
   * Genera la plantilla HTML del correo de verificación.
   * @param firstName - Nombre del usuario para personalizar el saludo.
   * @param url - URL de verificación que el usuario debe seguir.
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

  /**
   * Reenvía un correo de verificación si el usuario aún no ha verificado su email.
   * @param user - Datos del usuario que solicita el reenvío del correo.
   * @throws BadRequestException - Si el usuario no existe o ya está verificado.
   */
  async sendVerificationEmailAgain(user: UserRequest): Promise<void> {
    const userUnverified = await this.usuarioService.findByEmail(user.email);

    if (!userUnverified) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    if (userUnverified.email_verified) {
      throw new BadRequestException('El email ya está verificado.');
    }

    const payload: UserRequest = {
      roles: userUnverified.roles,
      sub: userUnverified._id,
      email: userUnverified.email,
    } as unknown as UserRequest;

    // Generar token de verificación
    const verificationToken = jwt.sign(payload, this.configService.jwtSecret, {
      expiresIn: '1h',
    });

    // Enviar correo de verificación
    await this.sendVerificationEmail(userUnverified, verificationToken);
  }

  /**
   * Verifica el token de verificación del email.
   * @param token - Token de verificación proporcionado por el usuario.
   * @returns URL de éxito si la verificación es exitosa.
   * @throws BadRequestException - Si el token es inválido o el email ya está verificado.
   * @throws InternalServerErrorException - Si ocurre algún otro error.
   */
  async verifyEmail(token: string): Promise<string> {
    if (!token) {
      throw new BadRequestException('Token de verificación no proporcionado.');
    }

    try {
      const payload = jwt.verify(
        token,
        this.configService.jwtSecret,
      ) as UserRequest;
      const user = await this.usuarioService.findByEmail(payload.email);

      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }

      if (user.email_verified) {
        throw new BadRequestException('El email ya está verificado.');
      }

      user.email_verified = true;
      await user.save();

      return 'http://localhost:3000/email/verification-success';
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('El token ha expirado.');
      } else if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Token inválido.');
      } else {
        throw new InternalServerErrorException('Error al verificar el email.');
      }
    }
  }
}
