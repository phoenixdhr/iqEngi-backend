import { Inject, Injectable } from '@nestjs/common'; // Importa decoradores y módulos de NestJS
import { ConfigType } from '@nestjs/config'; // Importa el tipo de configuración de NestJS
import { PassportStrategy } from '@nestjs/passport'; // Importa la estrategia de Passport.js
import { Strategy, VerifyCallback } from 'passport-google-oauth20'; // Importa la estrategia de Google OAuth 2.0 y el tipo de callback de verificación

import configEnv from 'src/common/enviroments/configEnv'; // Importa la configuración del entorno
import { ProfileGoogle } from '../../interfaces/google-perfil.interface';
import { UserGoogle } from '../../interfaces/google-user.interface';

@Injectable() // Marca la clase como inyectable para el sistema de dependencias de NestJS
export class GoogleStrategyService extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>, // Inyecta la configuración del entorno
  ) {
    super({
      clientID: configService.googleOauth.googleClientId, // Configura el ID del cliente de Google OAuth 2.0
      clientSecret: configService.googleOauth.googleClientSecret, // Configura el secreto del cliente de Google OAuth 2.0
      callbackURL: configService.googleOauth.googleCallbackUrl, // Configura la URL de callback para Google OAuth 2.0
      scope: ['email', 'profile'], // Solicita acceso al email y perfil del usuario
    });
  }

  // Método para configurar parámetros adicionales para la autorización
  // Es importante añadir esto para obtener el token de refresco
  authorizationParams(): object {
    return {
      access_type: 'offline', // Permite obtener un token de refresco
      prompt: 'consent', // Fuerza al usuario a seleccionar su cuenta y otorgar permisos nuevamente
    };
  }

  // Método de validación que se llama cuando Google devuelve el perfil del usuario
  async validate(
    accessToken: string, // Token de acceso proporcionado por Google
    refreshToken: string, // Token de refresco proporcionado por Google
    profile: ProfileGoogle, // Perfil del usuario devuelto por Google
    done: VerifyCallback, // Callback de verificación de Passport
  ) {
    // Verifica si el perfil contiene emails
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error('No se pudo obtener el email del usuario'), null); // Si no hay emails, devuelve un error
    }

    // Crea un objeto de usuario con la información del perfil
    const user: UserGoogle = {
      email: profile._json.email, // Email del usuario
      email_verified: profile._json.email_verified, // Indica si el email del usuario ha sido verificado
      firstName: profile._json?.given_name ?? '', // Primer nombre del usuario (opcional)
      lastName: profile._json?.family_name ?? '', // Apellido del usuario (opcional)
      picture: profile._json.picture ?? '', // URL de la foto de perfil del usuario (opcional)
      accessToken, // Token de acceso
      refreshToken, // Token de refresco
    };

    return user; // Devuelve el objeto de usuario
  }
}
