import { registerAs } from '@nestjs/config';

export default registerAs('configEnv', () => {
  const environment = process.env.ENVIRONMENT;
  const isProduction = environment === 'production';

  // Configuracion de mongo
  const dbName = process.env.MONGO_DB;
  const user = process.env.MONGO_INITDB_ROOT_USERNAME;
  const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
  const port: number = parseInt(process.env.MONGO_PORT, 10);
  const host = process.env.MONGO_HOST;
  const connection = process.env.MONGO_CONNECTION;
  const apiKey = process.env.API_KEY;
  const uri = `${connection}://${user}:${password}@${host}:${port}/`;

  // Configuracion de jwt
  const jwtSecret = process.env.JWT_SECRET;

  // Configuracion de google oauth
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const googleCallbackUrl = process.env.GOOGLE_REDIRECT_URI;

  // Configuracion de nodemailer
  const eHost = process.env.EMAIL_HOST;
  const ePort: number = parseInt(process.env.EMAIL_PORT);
  const eSecure: boolean = process.env.EMAIL_SECURE === 'true';
  const eUser = process.env.EMAIL_USER;
  const ePass = process.env.EMAIL_PASS;
  const dominioAPI = process.env.DOMINIO_URL_API;
  const dominioFrontend = process.env.DOMINIO_URL_FRONTEND;
  const dominioLocalHost = process.env.DOMINIO_LOCALHOST;

  return {
    environment,
    dominioAPI,
    dominioFrontend,
    dominioLocalHost,
    isProduction,
    mongo: {
      dbName,
      user,
      password,
      port,
      host,
      connection,
      apiKey,
      uri,
    },
    jwtSecret,
    googleOauth: {
      googleClientId,
      googleClientSecret,
      googleCallbackUrl,
    },
    email: {
      eHost,
      ePort,
      eSecure,
      eUser,
      ePass,
      dominioAPI,
      dominioFrontend,
    },
  };
});

export const port = process.env.PORT || 3000;
