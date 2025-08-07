import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  ALLOWED_ORIGINS: z.preprocess((val) => {
    if (typeof val === 'string') {
      return val.split(',').map((s) => s.trim());
    }
    return [];
  }, z.array(z.string().url())).default([]),
});

type envServer = z.infer<typeof envSchema>;
export const parsedEnv: envServer = envSchema.parse(process.env);

