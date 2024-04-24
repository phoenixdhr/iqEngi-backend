import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  API_KEY: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  PORT: Joi.number().required(),
});
