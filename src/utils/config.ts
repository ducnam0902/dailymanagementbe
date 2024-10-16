import 'dotenv/config';
import { z } from 'zod';

const configSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  ACCESS_KEY_SECRET: z.string(),
  REFRESH_KEY_SECRET: z.string(),
  ACCESS_KEY_EXPIRATION: z.string(),
  REFRESH_KEY_EXPIRATION: z.string(),
  UPLOADED_FILES_DESTINATION: z.string(),
  PUBLIC_API_ENDPOINT: z.string(),
  PUBLIC_API_PORT: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_ADDRESS: z.string(),
});

const configProject = configSchema.safeParse({
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  ACCESS_KEY_SECRET: process.env.ACCESS_KEY_SECRET,
  REFRESH_KEY_SECRET: process.env.REFRESH_KEY_SECRET,
  ACCESS_KEY_EXPIRATION: process.env.ACCESS_KEY_EXPIRATION,
  REFRESH_KEY_EXPIRATION: process.env.REFRESH_KEY_EXPIRATION,
  UPLOADED_FILES_DESTINATION: process.env.UPLOADED_FILES_DESTINATION,
  PUBLIC_API_ENDPOINT: process.env.PUBLIC_API_ENDPOINT,
  PUBLIC_API_PORT: process.env.PUBLIC_API_PORT,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error('Have some env variable is not available');
}

const envConfig = configProject.data;

export default envConfig;
