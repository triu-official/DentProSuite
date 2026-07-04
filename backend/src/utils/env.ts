import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  JWT_SECRET: z.string().min(16),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  STORAGE_MODE: z.enum(['local', 'appwrite']).default('local'),

  // Appwrite configuration (required if STORAGE_MODE === 'appwrite')
  APPWRITE_ENDPOINT: z.string().url().optional(),
  APPWRITE_PROJECT_ID: z.string().optional(),
  APPWRITE_API_KEY: z.string().optional(),
  APPWRITE_DATABASE_ID: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.STORAGE_MODE === 'appwrite') {
    const requiredAppwriteVars = ['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY', 'APPWRITE_DATABASE_ID'] as const;
    for (const v of requiredAppwriteVars) {
      if (!data[v]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${v} is required when STORAGE_MODE is 'appwrite'`,
          path: [v]
        });
      }
    }
  }
});

let _env: z.infer<typeof envSchema>;

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
  }

  _env = parsed.data;
  return _env;
}

export function getEnv() {
  if (!_env) {
    return validateEnv();
  }
  return _env;
}
