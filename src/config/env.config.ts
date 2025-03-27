import path from 'path';
import * as yup from 'yup';
import dotenv from 'dotenv';

export default function loadConfig(): void {
  const envPath = path.join(__dirname, '..', '..', '.env');

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    throw new Error(
      `Failed to load .env file from path ${envPath}: ${result.error.message}`
    );
  }

  const schema = yup.object({
    NODE_ENV: yup
      .string()
      .oneOf(['development', 'testing', 'production'])
      .required(),
    LOG_LEVEL: yup
      .string()
      .oneOf(['debug', 'info', 'warn', 'error', 'fatal'])
      .required(),
    API_HOST: yup.string().required(),
    API_PORT: yup.string().required(),
    DATABASE_URL: yup.string().required(),
    APP_JWT_SECRET: yup.string().required(),
  });

  try {
    schema.validateSync(process.env, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(`Config validation error: ${error.errors.join(', ')}`);
    }
    throw error;
  }
}
