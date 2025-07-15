import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10)
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
export type MongoUri = Env["MONGO_URI"];

