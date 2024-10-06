import { registerAs } from '@nestjs/config';

export default registerAs('configEnv', () => {
  const environment = process.env.NODE_ENV || 'development';
  const dbName = process.env.MONGO_DB;
  const user = process.env.MONGO_INITDB_ROOT_USERNAME;
  const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
  const port = parseInt(process.env.MONGO_PORT, 10);
  const host = process.env.MONGO_HOST;
  const connection = process.env.MONGO_CONNECTION;
  const apiKey = process.env.API_KEY;
  const uri = `${connection}://${user}:${password}@${host}:${port}/`;
  const jwtSecret = process.env.JWT_SECRET;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const googleCallbackUrl = process.env.REDIRECT_URI;

  return {
    environment,
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
  };
});

export const port = process.env.PORT || 3000;
