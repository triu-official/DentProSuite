import { z } from 'zod';
import dotenv from 'dotenv';

  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().min(16),
=======
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters long'),
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  // Storage settings
  STORAGE_ADAPTER: z.enum(['local', 'local-json', 'appwrite']).default('local'),

  // Appwrite configuration (only required if STORAGE_ADAPTER is appwrite)
  APPWRITE_ENDPOINT: z.string().url().optional(),
  APPWRITE_PROJECT_ID: z.string().optional(),
  APPWRITE_API_KEY: z.string().optional(),
  APPWRITE_DATABASE_ID: z.string().optional(),
}).refine(data => {
  if (data.STORAGE_ADAPTER === 'appwrite') {
    return !!(data.APPWRITE_ENDPOINT && data.APPWRITE_PROJECT_ID && data.APPWRITE_API_KEY && data.APPWRITE_DATABASE_ID);
  }
  return true;
}, {
  message: "Appwrite configuration is required when STORAGE_ADAPTER is 'appwrite'",
});

export type EnvConfig = z.infer<typeof envSchema>;

let cachedEnv: EnvConfig;

export function validateEnv(): EnvConfig {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getEnv(): EnvConfig {
  if (!cachedEnv) return validateEnv();
  return cachedEnv;
}
