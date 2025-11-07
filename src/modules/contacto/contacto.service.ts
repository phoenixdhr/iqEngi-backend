import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigType } from '@nestjs/config';
import { Resend } from 'resend';

import { Contacto } from './entities/contacto.entity';
import { CrearContactoDto } from './dtos/crear-contacto.dto';
import { ContactoResponseDto } from './dtos/contacto-response.dto';
import configEnv from 'src/common/enviroments/configEnv';

@Injectable()
export class ContactoService {
  private resend: Resend;

  constructor(
    @InjectModel(Contacto.name)
    private readonly contactoModel: Model<Contacto>,
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>,
  ) {
    // Inicializar Resend con la API key del entorno
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY no está configurada');
    } else {
      this.resend = new Resend(resendApiKey);
    }
  }

  /**
   * Procesa el formulario de contacto: guarda en BD y envía email
   */
  async procesarContacto(
    crearContactoDto: CrearContactoDto,
  ): Promise<ContactoResponseDto> {
    try {
      // Validar que Resend esté configurado
      if (!this.resend) {
        throw new InternalServerErrorException(
          'Servicio de email no configurado',
        );
      }

      // Guardar en la base de datos
      const contacto = new this.contactoModel(crearContactoDto);
      await contacto.save();

      // Enviar email usando Resend
      await this.enviarEmailContacto(crearContactoDto, contacto._id.toString());

      // Marcar como procesado
      contacto.procesado = true;
      await contacto.save();

      // Si el usuario aceptó newsletter, se podría guardar en la entidad UsuarioTicket
      if (crearContactoDto.newsletter) {
        // TODO: Implementar lógica para agregar a newsletter
        console.log(
          `Usuario ${crearContactoDto.email} aceptó recibir newsletter`,
        );
      }

      return {
        success: true,
        message: 'Mensaje enviado correctamente',
      };
    } catch (error) {
      console.error('Error al procesar contacto:', error);

      return {
        success: false,
        message: 'Error al enviar el mensaje',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Envía el email de contacto usando Resend
   */
  private async enviarEmailContacto(
    datos: CrearContactoDto,
    contactoId: string,
  ): Promise<void> {
    const emailHtml = this.generarPlantillaEmail(datos, contactoId);

    const emailRecipient =
      process.env.CONTACT_EMAIL || this.configService.email.eUser;

    try {
      await this.resend.emails.send({
        from: `IqEngi - ${datos.nombre} - ${datos.empresa} <${'onboarding@resend.dev'}>`, // Cambiar por tu dominio verificado 'IqEngi Contacto <onboarding@resend.dev>'
        to: emailRecipient,
        subject: `Nuevo mensaje de contacto: ${datos.motivo}`,
        html: emailHtml,
        replyTo: datos.email,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar email con Resend',
        error.message,
      );
    }
  }

  /**
   * Genera la plantilla HTML del email
   */
  private generarPlantillaEmail(
    datos: CrearContactoDto,
    contactoId: string,
  ): string {
    const fecha = new Date().toLocaleString('es-ES', {
      timeZone: 'America/Lima',
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #1f2937; }
              .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 3px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2 style="margin: 0;">Nuevo mensaje de contacto - IqEngi</h2>
              </div>
              <div class="content">
                  <div class="field">
                      <div class="label">ID de Contacto:</div>
                      <div class="value">${contactoId}</div>
                  </div>
                  <div class="field">
                      <div class="label">Nombre:</div>
                      <div class="value">${datos.nombre}</div>
                  </div>
                  <div class="field">
                      <div class="label">Email:</div>
                      <div class="value">${datos.email}</div>
                  </div>
                  ${
                    datos.empresa
                      ? `
                  <div class="field">
                      <div class="label">Empresa:</div>
                      <div class="value">${datos.empresa}</div>
                  </div>
                  `
                      : ''
                  }
                  <div class="field">
                      <div class="label">Motivo de consulta:</div>
                      <div class="value">${datos.motivo}</div>
                  </div>
                  <div class="field">
                      <div class="label">Mensaje:</div>
                      <div class="value">${datos.mensaje.replace(/\n/g, '<br>')}</div>
                  </div>
                  <div class="field">
                      <div class="label">Newsletter:</div>
                      <div class="value">${datos.newsletter ? 'Sí, acepta recibir información' : 'No'}</div>
                  </div>
                  <div class="footer">
                      <p>Este mensaje fue enviado desde el formulario de contacto de IqEngi.</p>
                      <p>Fecha: ${fecha}</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  /**
   * Obtiene todos los contactos (para administración)
   */
  async obtenerContactos(): Promise<Contacto[]> {
    return this.contactoModel.find({ deleted: false }).sort({ createdAt: -1 });
  }

  /**
   * Obtiene un contacto por ID
   */
  async obtenerContactoPorId(id: string): Promise<Contacto> {
    return this.contactoModel.findById(id);
  }
}
