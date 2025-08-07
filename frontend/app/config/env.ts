// TO-DO: have to use mini to reduce bundler size up to 6 times smaller moving forward.
import * as z from "zod"; 

const clientEnvSchema = z.object({
    VITE_API_BASE_URL: z.string().url(),
    VITE_API_PREFIX: z.string().default('/api'),

    VITE_ENABLE_MOCK_DATA: z
        .enum(['true', 'false'])
        .transform(v => v === 'true'),

    VITE_APP_NAME: z.string(),
    VITE_APP_VERSION: z.string(),

    MODE: z.enum([
        'development', 
        'production', 
        'test', 
        'staging'
    ]).default('development'),
    DEV: z.coerce.boolean(),
    PROD: z.coerce.boolean(),
})

type ClientEnv = z.infer<typeof clientEnvSchema>

const testEnv = clientEnvSchema.safeParse(import.meta.env);
if (!testEnv.success) {
  console.error('Env validation failed:', testEnv.error.format());
  process.exit(1);
}

export const parsedEnv: ClientEnv = testEnv.data;
console.log(parsedEnv) // DO NOT DELETE THIS

export const isDev = testEnv.data.DEV;
export const isProd = testEnv.data.PROD;