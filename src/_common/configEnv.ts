import { registerAs } from '@nestjs/config';

export default registerAs('configEnv', () => {
  const dbName = process.env.MONGO_DB;
  const user = process.env.MONGO_INITDB_ROOT_USERNAME;
  const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
  const port = parseInt(process.env.MONGO_PORT, 10);
  const host = process.env.MONGO_HOST;
  const connection = process.env.MONGO_CONNECTION;
  const apiKey = process.env.API_KEY;
  const uri = `${connection}://${user}:${password}@${host}:${port}/`;
  const jwtSecret = process.env.JWT_SECRET;

  return {
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
  };
});

export const port = process.env.PORT || 3000;
