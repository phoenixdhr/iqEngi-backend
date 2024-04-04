import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('configEnv', () => ({
  database: {
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  },
  apiKey: process.env.API_KEY,
}));

export const configValidationSchema = Joi.object({
  API_KEY: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
});

export const port = process.env.DATABASE_PORT || 3000;
