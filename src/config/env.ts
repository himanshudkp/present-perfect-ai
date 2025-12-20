import { z } from "zod";

const envSchema = z.object({
  CLERK_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
